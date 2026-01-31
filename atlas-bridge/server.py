import os
import re
import json
import shutil
import asyncio
import subprocess
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from datetime import timedelta
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List, Optional
from fastmcp import FastMCP



# ============================================================
# Atlas-Bridge MCP Server (scoped, hardened)
# Base scope: repository root (parent of atlas-bridge/)
# ============================================================

# --- Scope / Paths ---
BASE_DIR = Path(__file__).resolve().parent.parent
BACKUP_DIR = (BASE_DIR / ".backups").resolve()
LOG_DIR = (BASE_DIR / ".logs").resolve()
BACKUP_DIR.mkdir(parents=True, exist_ok=True)
LOG_DIR.mkdir(parents=True, exist_ok=True)

# --- Defaults / Env ---
DRY_RUN_DEFAULT = os.environ.get("ATLAS_BRIDGE_DRYRUN", "1").lower() in ("1", "true", "yes", "y")
READ_ONLY_DEFAULT = os.environ.get("ATLAS_BRIDGE_READONLY", "0").lower() in ("1", "true", "yes", "y")

SHELL_TIMEOUT_DEFAULT = int(os.environ.get("ATLAS_BRIDGE_SHELL_TIMEOUT", "20"))  # seconds
MAX_OUTPUT_BYTES = int(os.environ.get("ATLAS_BRIDGE_MAX_OUTPUT_BYTES", "200000"))  # 200 KB cap

# Allow only these file extensions for writes (hard guard)
ALLOWED_WRITE_EXT = {".py", ".json", ".md", ".txt"}

# Ignore patterns
IGNORE_DIRS = {".git", "__pycache__", ".venv", "venv", ".mypy_cache", ".pytest_cache", "node_modules"}
IGNORE_FILES = {".DS_Store"}

# Command blocking (defense-in-depth)
FORBIDDEN_SUBSTRINGS = [
    "rm -rf",
    "mkfs",
    "shutdown",
    "reboot",
    ":(){:|:&};:",      # fork bomb
    "sudo ",
    "dd ",
    "kill -9",
    "launchctl",
    "osascript",
    "chmod -R",
    "chown -R",
]

# Additionally block suspicious redirections/pipes that try to write outside scope
SUSPICIOUS_SHELL = [
    r">\s*/",           # redirect to absolute path
    r">>\s*/",
    r"\|\s*tee\s+/",    # tee to absolute path
]

# If you want to be stricter: allowlist a small set of commands
STRICT_ALLOWLIST = os.environ.get("ATLAS_BRIDGE_STRICT", "0").lower() in ("1", "true", "yes", "y")
ALLOWLIST_PREFIXES = [
    "python", "python3", "pip", "pip3",
    "pytest", "ruff", "black",
    "git ", "ls", "pwd", "cat", "echo",
    "node", "npm", "pnpm", "yarn",
]

mcp = FastMCP("Atlas-Bridge")


# ============================================================
# Helpers
# ============================================================

def _now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


def _log(event: str, data: Dict[str, Any]) -> None:
    # Simple line-delimited JSON log (append-only)
    entry = {"ts": _now_iso(), "event": event, **data}
    logfile = LOG_DIR / "atlas-bridge.log.jsonl"
    with logfile.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def _resolve_inside_base(rel_path: str) -> Path:
    # Normalize and resolve without allowing base escape
    # Empty path resolves to BASE_DIR
    target = (BASE_DIR / rel_path).resolve()
    try:
        target.relative_to(BASE_DIR)
    except Exception:
        raise PermissionError("Access outside BASE_DIR is forbidden.")
    return target


def _backup_file(target: Path) -> Optional[str]:
    if target.exists() and target.is_file():
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        # Preserve relative structure in backups
        rel = target.relative_to(BASE_DIR)
        backup_target = (BACKUP_DIR / rel).with_suffix(rel.suffix + f".{ts}.bak")
        backup_target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(target, backup_target)
        return str(backup_target)
    return None


def _check_write_extension(target: Path) -> None:
    if target.suffix.lower() not in ALLOWED_WRITE_EXT:
        raise PermissionError(f"Write blocked. Allowed extensions: {sorted(ALLOWED_WRITE_EXT)}")


def _security_check_command(cmd: str) -> None:
    c = cmd.strip()

    # Strict allowlist mode
    if STRICT_ALLOWLIST:
        if not any(c == p or c.startswith(p) for p in ALLOWLIST_PREFIXES):
            raise ValueError("Command blocked by STRICT allowlist policy.")

    # Substring blocks
    for s in FORBIDDEN_SUBSTRINGS:
        if s in c:
            raise ValueError(f"Blocked dangerous command substring: {s}")

    # Regex blocks
    for pat in SUSPICIOUS_SHELL:
        if re.search(pat, c):
            raise ValueError(f"Blocked suspicious shell pattern: {pat}")

    # Basic sanity
    if len(c) == 0:
        raise ValueError("Empty command not allowed.")


def _truncate_bytes(b: bytes) -> bytes:
    if len(b) <= MAX_OUTPUT_BYTES:
        return b
    return b[:MAX_OUTPUT_BYTES] + b"\n...[truncated]"


def _result(ok: bool, **kwargs) -> str:
    # Stable JSON response as string (easy for agents)
    return json.dumps({"ok": ok, **kwargs}, ensure_ascii=False)


# ============================================================
# Optional HTTP Adapter (simple /mcp POST endpoint)
# ============================================================

def _start_http_adapter(port: int, background: bool = True) -> HTTPServer:
    def _parse_iso_date(s: str) -> Optional[datetime]:
        if not s or not isinstance(s, str):
            return None
        try:
            # Accept YYYY-MM-DD (preferred)
            return datetime.fromisoformat(s.strip())
        except Exception:
            return None

    def _easter_sunday(year: int) -> datetime:
        # Anonymous Gregorian algorithm (Meeus/Jones/Butcher).
        a = year % 19
        b = year // 100
        c = year % 100
        d = b // 4
        e = b % 4
        f = (b + 8) // 25
        g = (b - f + 1) // 3
        h = (19 * a + b - d - g + 15) % 30
        i = c // 4
        k = c % 4
        l = (32 + 2 * e + 2 * i - h - k) % 7
        m = (a + 11 * h + 22 * l) // 451
        month = (h + l - 7 * m + 114) // 31
        day = ((h + l - 7 * m + 114) % 31) + 1
        return datetime(year, month, day)

    def _german_holidays(year: int, state: str) -> set:
        """
        Holiday set for Germany with a practical subset.
        State-specific handling for BY (Bayern).
        Note: Does not implement municipality-only holidays (e.g., Augsburg Peace Festival).
        """
        state = (state or "").upper()
        easter = _easter_sunday(year)
        holidays = {
            datetime(year, 1, 1).date(),  # Neujahr
            datetime(year, 5, 1).date(),  # Tag der Arbeit
            datetime(year, 10, 3).date(),  # Tag der Deutschen Einheit
            datetime(year, 12, 25).date(),  # 1. Weihnachtstag
            datetime(year, 12, 26).date(),  # 2. Weihnachtstag
            (easter - timedelta(days=2)).date(),  # Karfreitag
            (easter + timedelta(days=1)).date(),  # Ostermontag
            (easter + timedelta(days=39)).date(),  # Christi Himmelfahrt
            (easter + timedelta(days=50)).date(),  # Pfingstmontag
        }

        if state == "BY":
            holidays.update(
                {
                    datetime(year, 1, 6).date(),  # Heilige Drei Koenige
                    (easter + timedelta(days=60)).date(),  # Fronleichnam
                    datetime(year, 8, 15).date(),  # Mariae Himmelfahrt (regional in BY; treated as BY-wide here)
                    datetime(year, 11, 1).date(),  # Allerheiligen
                }
            )

        return holidays

    def _is_business_day(d: datetime, state: str) -> bool:
        dd = d.date()
        if d.weekday() >= 5:
            return False
        return dd not in _german_holidays(dd.year, state)

    def _adjust_to_previous_business_day(d: datetime, state: str) -> datetime:
        cur = d.replace(hour=0, minute=0, second=0, microsecond=0)
        while not _is_business_day(cur, state):
            cur = cur - timedelta(days=1)
        return cur

    def _add_business_days(start: datetime, days: int, state: str, adjust: str) -> datetime:
        # Business days = Mon-Fri excluding German holidays (state-specific).
        if days <= 0:
            return _adjust_to_previous_business_day(start, state) if adjust == "previous" else start

        d = start.replace(hour=0, minute=0, second=0, microsecond=0)
        added = 0
        while added < days:
            d = d + timedelta(days=1)
            if _is_business_day(d, state):
                added += 1

        # If a rule results in a non-business day (e.g., explicit due_date), adjust per policy.
        if adjust == "previous":
            d = _adjust_to_previous_business_day(d, state)
        return d

    def _business_days_until(start: datetime, end: datetime, state: str) -> int:
        """
        Count business days difference from start -> end.
        If end is before start, returns negative value.
        """
        s = start.replace(hour=0, minute=0, second=0, microsecond=0)
        e = end.replace(hour=0, minute=0, second=0, microsecond=0)
        if s.date() == e.date():
            return 0

        step = 1 if e > s else -1
        count = 0
        cur = s
        while cur.date() != e.date():
            cur = cur + timedelta(days=step)
            if _is_business_day(cur, state):
                count += step
        return count

    def _parse_frontmatter(md: str) -> Dict[str, Any]:
        """
        Minimal YAML frontmatter parser (no external deps).
        Supported:
          - key: value
          - key: [a, b]
          - key:
              - a
              - b
        Everything else is ignored.
        """
        if not md:
            return {}

        lines = md.splitlines()
        if not lines or lines[0].strip() != "---":
            return {}

        fm_lines: List[str] = []
        for i in range(1, len(lines)):
            if lines[i].strip() == "---":
                break
            fm_lines.append(lines[i])
        else:
            return {}

        result: Dict[str, Any] = {}
        i = 0
        while i < len(fm_lines):
            raw = fm_lines[i]
            if not raw.strip() or raw.lstrip().startswith("#"):
                i += 1
                continue

            # List item without key is ignored.
            if raw.lstrip().startswith("- "):
                i += 1
                continue

            if ":" not in raw:
                i += 1
                continue

            key, value = raw.split(":", 1)
            key = key.strip()
            value = value.strip()

            # Multi-line list (strings only)
            if value == "":
                items: List[str] = []
                j = i + 1
                while j < len(fm_lines):
                    nxt = fm_lines[j]
                    if not nxt.strip():
                        j += 1
                        continue
                    if ":" in nxt and not nxt.lstrip().startswith("- "):
                        break
                    if nxt.lstrip().startswith("- "):
                        items.append(nxt.lstrip()[2:].strip().strip('"').strip("'"))
                    j += 1
                result[key] = items
                i = j
                continue

            # Inline list
            if value.startswith("[") and value.endswith("]"):
                inner = value[1:-1].strip()
                if inner == "":
                    result[key] = []
                else:
                    result[key] = [
                        part.strip().strip('"').strip("'")
                        for part in inner.split(",")
                        if part.strip()
                    ]
                i += 1
                continue

            # Scalar
            scalar = value.strip().strip('"').strip("'")
            if scalar.lower() in ("true", "false"):
                result[key] = scalar.lower() == "true"
            else:
                result[key] = scalar
            i += 1

        return result

    def _parse_deadlines(frontmatter_md: str) -> List[Dict[str, Any]]:
        """
        Parse a YAML-ish `deadlines:` list-of-maps block from frontmatter.
        Supported shape:
          deadlines:
            - id: foo
              label: "..."
              received_date: YYYY-MM-DD
              rule: plus_business_days:14
              due_date: YYYY-MM-DD
              next_action: "..."
        """
        if not frontmatter_md:
            return []

        lines = frontmatter_md.splitlines()
        if not lines or lines[0].strip() != "---":
            return []

        fm_lines: List[str] = []
        for i in range(1, len(lines)):
            if lines[i].strip() == "---":
                break
            fm_lines.append(lines[i])
        else:
            return []

        # Find `deadlines:` line.
        start_idx = None
        for idx, ln in enumerate(fm_lines):
            if ln.strip() == "deadlines:":
                start_idx = idx + 1
                break
        if start_idx is None:
            return []

        items: List[Dict[str, Any]] = []
        cur: Optional[Dict[str, Any]] = None
        i = start_idx
        while i < len(fm_lines):
            ln = fm_lines[i]
            if not ln.strip():
                i += 1
                continue

            # Stop when we hit a new top-level key.
            if not ln.startswith(" ") and ":" in ln:
                break

            s = ln.strip()
            if s.startswith("- "):
                if cur:
                    items.append(cur)
                cur = {}
                rest = s[2:].strip()
                if ":" in rest:
                    k, v = rest.split(":", 1)
                    cur[k.strip()] = v.strip().strip('"').strip("'")
                i += 1
                continue

            if cur is not None and ":" in s:
                k, v = s.split(":", 1)
                cur[k.strip()] = v.strip().strip('"').strip("'")

            i += 1

        if cur:
            items.append(cur)

        return items

    def _extract_next_action(task_md: str) -> str:
        # Naive "first unchecked task" parser for markdown checklists.
        for line in (task_md or "").splitlines():
            s = line.strip()
            if s.startswith("- [ ]") or s.startswith("* [ ]"):
                return s[5:].strip()
        return ""

    def _build_dashboard_state(domain: str) -> Dict[str, Any]:
        # Minimal "dashboard data stream" from local companion-system folders.
        # This is intentionally naive; it creates stable IDs + useful summaries.
        if domain != "recht":
            return {"cases": [], "incidents": [], "evidence": [], "logs": []}

        # Bavaria + "previous business day" as requested.
        holiday_state = os.environ.get("COMPANION_HOLIDAY_STATE", "BY").upper()
        due_adjust = os.environ.get("COMPANION_DUE_ADJUST", "previous").lower()

        base = (BASE_DIR / "03_Fallakten_Meta").resolve()
        cases: List[Dict[str, Any]] = []
        deadlines: List[Dict[str, Any]] = []
        if base.exists():
            for p in sorted(base.glob("Recht_*")):
                if not p.is_dir():
                    continue
                title = p.name.replace("Recht_", "").replace("_", " ").strip() or p.name
                case_id = f"case-{p.name.lower()}"
                aufgaben = (p / "Aufgaben.md")
                notes = (p / "Notizen.md")
                readme = (p / "README.md")
                fristen = (p / "Fristen.md")
                timeline = (p / "Timeline.md")

                next_action = ""
                if aufgaben.exists():
                    next_action = _extract_next_action(aufgaben.read_text(encoding="utf-8", errors="replace"))

                fm: Dict[str, Any] = {}
                if readme.exists():
                    fm = _parse_frontmatter(readme.read_text(encoding="utf-8", errors="replace"))
                if not fm and notes.exists():
                    fm = _parse_frontmatter(notes.read_text(encoding="utf-8", errors="replace"))

                fr: Dict[str, Any] = {}
                fr_raw = ""
                if fristen.exists():
                    fr_raw = fristen.read_text(encoding="utf-8", errors="replace")
                    fr = _parse_frontmatter(fr_raw)

                # Map frontmatter to dashboard fields (safe defaults).
                status = fm.get("status") or "aktiv"
                risk_level = fm.get("risk_level") or "mittel"
                deadline_date = fm.get("deadline_date") or None
                # Prefer deadline derived from Fristen.md if present.
                # Supported (single):
                #   received_date: YYYY-MM-DD
                #   deadline_rule: plus_business_days:14
                # Supported (multi):
                #   deadlines: (see _parse_deadlines)
                if fr:
                    # Local overrides
                    if isinstance(fr.get("state"), str):
                        holiday_state = fr.get("state").upper()
                    if isinstance(fr.get("due_adjust"), str):
                        due_adjust = fr.get("due_adjust").lower()

                    deadline_items = _parse_deadlines(fr_raw)
                    computed_due_dates: List[datetime] = []

                    if deadline_items:
                        # Choose earliest due date as the case-level deadline.
                        for item in deadline_items:
                            due_dt: Optional[datetime] = None
                            if isinstance(item.get("due_date"), str):
                                due_dt = _parse_iso_date(item.get("due_date"))
                                if due_dt and due_adjust == "previous":
                                    due_dt = _adjust_to_previous_business_day(due_dt, holiday_state)
                            else:
                                received_dt = _parse_iso_date(item.get("received_date")) if isinstance(item.get("received_date"), str) else None
                                rule_raw = item.get("rule")
                                business_days = None
                                if isinstance(rule_raw, str) and rule_raw.startswith("plus_business_days:"):
                                    try:
                                        business_days = int(rule_raw.split(":", 1)[1].strip())
                                    except Exception:
                                        business_days = None
                                if received_dt and business_days is not None:
                                    due_dt = _add_business_days(received_dt, business_days, holiday_state, due_adjust)

                            if due_dt:
                                computed_due_dates.append(due_dt)
                                due_in = _business_days_until(datetime.now(), due_dt, holiday_state)
                                label = item.get("label") or "Frist"
                                deadline_id = item.get("id") or f"{case_id}-{label}".lower().replace(" ", "_")
                                deadlines.append(
                                    {
                                        "id": deadline_id,
                                        "case_id": case_id,
                                        "case_title": fm.get("title") or title,
                                        "label": label,
                                        "due_date": due_dt.date().isoformat(),
                                        "received_date": item.get("received_date"),
                                        "rule": item.get("rule"),
                                        "next_action": item.get("next_action") or next_action,
                                        "due_in_business_days": due_in,
                                        "status": "overdue" if due_in < 0 else ("soon" if due_in <= 3 else "ok"),
                                    }
                                )

                        if computed_due_dates:
                            earliest = min(computed_due_dates)
                            deadline_date = earliest.date().isoformat()

                        # Use next_action from the earliest deadline if available.
                        if computed_due_dates:
                            earliest_due = min(computed_due_dates)
                            for item in deadline_items:
                                # Recompute its due for matching; small, acceptable for phase 1.
                                item_due: Optional[datetime] = None
                                if isinstance(item.get("due_date"), str):
                                    item_due = _parse_iso_date(item.get("due_date"))
                                    if item_due and due_adjust == "previous":
                                        item_due = _adjust_to_previous_business_day(item_due, holiday_state)
                                else:
                                    received_dt = _parse_iso_date(item.get("received_date")) if isinstance(item.get("received_date"), str) else None
                                    rule_raw = item.get("rule")
                                    business_days = None
                                    if isinstance(rule_raw, str) and rule_raw.startswith("plus_business_days:"):
                                        try:
                                            business_days = int(rule_raw.split(":", 1)[1].strip())
                                        except Exception:
                                            business_days = None
                                    if received_dt and business_days is not None:
                                        item_due = _add_business_days(received_dt, business_days, holiday_state, due_adjust)
                                if item_due and item_due.date() == earliest_due.date():
                                    if item.get("next_action"):
                                        next_action = str(item.get("next_action"))
                                    break

                    else:
                        received_raw = fr.get("received_date")
                        rule_raw = fr.get("deadline_rule")
                        received_dt = _parse_iso_date(received_raw) if isinstance(received_raw, str) else None
                        business_days = None
                        if isinstance(rule_raw, str) and rule_raw.startswith("plus_business_days:"):
                            try:
                                business_days = int(rule_raw.split(":", 1)[1].strip())
                            except Exception:
                                business_days = None
                        if received_dt and business_days is not None:
                            computed = _add_business_days(received_dt, business_days, holiday_state, due_adjust)
                            deadline_date = computed.date().isoformat()
                            due_in = _business_days_until(datetime.now(), computed, holiday_state)
                            label = fr.get("label") or "Frist"
                            deadline_id = f"{case_id}-{label}".lower().replace(" ", "_")
                            deadlines.append(
                                {
                                    "id": deadline_id,
                                    "case_id": case_id,
                                    "case_title": fm.get("title") or title,
                                    "label": label,
                                    "due_date": computed.date().isoformat(),
                                    "received_date": received_raw,
                                    "rule": rule_raw,
                                    "next_action": fr.get("next_action") or next_action,
                                    "due_in_business_days": due_in,
                                    "status": "overdue" if due_in < 0 else ("soon" if due_in <= 3 else "ok"),
                                }
                            )
                        if fr.get("next_action"):
                            next_action = str(fr.get("next_action"))
                elif deadline_date:
                    # Fallback: create a deadline entry from case-level deadline_date.
                    due_dt = _parse_iso_date(deadline_date)
                    if due_dt:
                        due_in = _business_days_until(datetime.now(), due_dt, holiday_state)
                        deadline_id = f"{case_id}-frist".lower()
                        deadlines.append(
                            {
                                "id": deadline_id,
                                "case_id": case_id,
                                "case_title": fm.get("title") or title,
                                "label": "Frist",
                                "due_date": due_dt.date().isoformat(),
                                "next_action": next_action,
                                "due_in_business_days": due_in,
                                "status": "overdue" if due_in < 0 else ("soon" if due_in <= 3 else "ok"),
                            }
                        )
                tags = fm.get("tags") or ["companion"]
                if isinstance(tags, str):
                    tags = [tags]

                # Optional metadata.
                lawyer = fm.get("lawyer") or None
                court = fm.get("court") or None
                counterparty = fm.get("counterparty") or None
                owner = fm.get("owner") or "Ich"

                # Use newest mtime as "last_update_at"
                mtimes: List[float] = []
                for f in (aufgaben, notes, readme, fristen, timeline):
                    if f.exists():
                        mtimes.append(f.stat().st_mtime)
                last_update_at = datetime.fromtimestamp(max(mtimes) if mtimes else p.stat().st_mtime).isoformat()

                cases.append(
                    {
                        "id": case_id,
                        "title": fm.get("title") or title,
                        "domain": "recht",
                        "category": "sonstiges",
                        "status": status,
                        "risk_level": risk_level,
                        "next_action": next_action,
                        "deadline_date": deadline_date,
                        "last_update_at": last_update_at,
                        "owner": owner,
                        "file_reference": str(p.relative_to(BASE_DIR)),
                        "tags": tags,
                        "lawyer": lawyer,
                        "court": court,
                        "counterparty": counterparty,
                    }
                )

        return {"cases": cases, "deadlines": deadlines, "incidents": [], "evidence": [], "logs": []}

    class MCPHandler(BaseHTTPRequestHandler):
        def _set_headers(self, status: int = 200) -> None:
            self.send_response(status)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
            self.end_headers()

        def do_OPTIONS(self) -> None:
            self._set_headers(200)

        def do_POST(self) -> None:
            if self.path != "/mcp":
                self._set_headers(404)
                self.wfile.write(_result(False, error="Not found").encode("utf-8"))
                return

            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length).decode("utf-8", errors="replace")
            try:
                payload = json.loads(raw) if raw else {}
            except json.JSONDecodeError:
                self._set_headers(400)
                self.wfile.write(_result(False, error="Invalid JSON").encode("utf-8"))
                return

            tool = payload.get("tool")
            args = payload.get("payload") or {}

            try:
                if tool == "list_files":
                    result = list_files(**args)
                elif tool == "read_file":
                    result = read_file(**args)
                elif tool == "write_file":
                    result = write_file(**args)
                elif tool == "run_shell_command":
                    result = asyncio.run(run_shell_command(**args))
                else:
                    self._set_headers(400)
                    self.wfile.write(_result(False, error="Unknown tool").encode("utf-8"))
                    return
            except Exception as exc:
                self._set_headers(500)
                self.wfile.write(_result(False, error=str(exc)).encode("utf-8"))
                return

            self._set_headers(200)
            self.wfile.write(result.encode("utf-8"))

        def do_GET(self) -> None:
            # Dashboard data stream for the React UI.
            # Example: /dashboard-data?domain=recht
            if self.path.startswith("/dashboard-data"):
                from urllib.parse import urlparse, parse_qs

                parsed = urlparse(self.path)
                qs = parse_qs(parsed.query or "")
                domain = (qs.get("domain") or ["recht"])[0]
                state = _build_dashboard_state(domain)
                self._set_headers(200)
                self.wfile.write(json.dumps(state, ensure_ascii=False).encode("utf-8"))
                return

            if self.path == "/health":
                self._set_headers(200)
                self.wfile.write(_result(True, status="ok").encode("utf-8"))
                return

            self._set_headers(404)
            self.wfile.write(_result(False, error="Not found").encode("utf-8"))

        def log_message(self, format: str, *args: Any) -> None:
            # Silence default HTTP logs to keep output clean.
            return

    server = HTTPServer(("127.0.0.1", port), MCPHandler)
    if background:
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
    _log("http_adapter_start", {"port": port})
    return server


# ============================================================
# Tools
# ============================================================

@mcp.tool()
def list_files(path: str = "") -> str:
    """
    Recursively lists files within BASE_DIR, ignoring .git and OS junk.
    Returns JSON string: { ok, base_dir, path, files[] }
    """
    target = _resolve_inside_base(path)

    if target.is_file():
        return _result(True, base_dir=str(BASE_DIR), path=path, files=[str(target.relative_to(BASE_DIR))])

    files: List[str] = []
    for root, dirs, filenames in os.walk(target):
        root_path = Path(root)

        # Filter dirs in-place for os.walk
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        for fn in filenames:
            if fn in IGNORE_FILES:
                continue
            full = (root_path / fn)
            # Always re-check inside base (defense)
            try:
                rel = full.resolve().relative_to(BASE_DIR)
            except Exception:
                continue
            files.append(str(rel))

    files.sort()
    _log("list_files", {"path": path, "count": len(files)})
    return _result(True, base_dir=str(BASE_DIR), path=path, files=files)


@mcp.tool()
def read_file(path: str) -> str:
    """
    Reads a file under BASE_DIR.
    Returns JSON string: { ok, path, content }
    """
    target = _resolve_inside_base(path)
    if not target.exists() or not target.is_file():
        return _result(False, error="File not found", path=path)

    content = target.read_text(encoding="utf-8", errors="replace")
    _log("read_file", {"path": path, "bytes": len(content.encode("utf-8", errors="ignore"))})
    return _result(True, path=path, content=content)


@mcp.tool()
def write_file(path: str, content: str, dry_run: Optional[bool] = None) -> str:
    """
    Writes/overwrites a file under BASE_DIR with backup + dry-run.
    Hard-guard: only .py, .json, .md, .txt.
    Returns JSON string: { ok, path, dry_run, backup_path?, bytes_written? }
    """
    if READ_ONLY_DEFAULT:
        return _result(False, error="Server is in READ_ONLY mode (ATLAS_BRIDGE_READONLY=1).", path=path)

    if dry_run is None:
        dry_run = DRY_RUN_DEFAULT

    target = _resolve_inside_base(path)
    _check_write_extension(target)

    if dry_run:
        _log("write_file_dry_run", {"path": path, "bytes": len(content.encode("utf-8", errors="ignore"))})
        return _result(True, path=path, dry_run=True)

    target.parent.mkdir(parents=True, exist_ok=True)
    backup_path = _backup_file(target)

    target.write_text(content, encoding="utf-8")
    bytes_written = len(content.encode("utf-8", errors="ignore"))

    _log("write_file", {"path": path, "backup": backup_path, "bytes": bytes_written})
    return _result(True, path=path, dry_run=False, backup_path=backup_path, bytes_written=bytes_written)


@mcp.tool()
async def run_shell_command(command: str, dry_run: Optional[bool] = None, timeout: Optional[int] = None) -> str:
    """
    Executes a shell command (cwd=BASE_DIR) with security checks + timeout.
    Returns JSON string: { ok, command, dry_run, timeout, exit_code, stdout, stderr }
    """
    if READ_ONLY_DEFAULT:
        return _result(False, error="Server is in READ_ONLY mode (ATLAS_BRIDGE_READONLY=1).", command=command)

    if dry_run is None:
        dry_run = DRY_RUN_DEFAULT

    if timeout is None:
        timeout = SHELL_TIMEOUT_DEFAULT

    try:
        _security_check_command(command)
    except Exception as e:
        _log("shell_blocked", {"command": command, "reason": str(e)})
        return _result(False, error=str(e), command=command, dry_run=dry_run, timeout=timeout)

    if dry_run:
        _log("shell_dry_run", {"command": command, "timeout": timeout})
        return _result(True, command=command, dry_run=True, timeout=timeout)

    # Execute
    _log("shell_start", {"command": command, "timeout": timeout})

    proc = await asyncio.create_subprocess_shell(
        command,
        cwd=str(BASE_DIR),
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )

    try:
        stdout_b, stderr_b = await asyncio.wait_for(proc.communicate(), timeout=timeout)
    except asyncio.TimeoutError:
        proc.kill()
        _log("shell_timeout", {"command": command, "timeout": timeout})
        return _result(False, error="Command timed out", command=command, dry_run=False, timeout=timeout)

    stdout_b = _truncate_bytes(stdout_b or b"")
    stderr_b = _truncate_bytes(stderr_b or b"")

    exit_code = proc.returncode
    ok = (exit_code == 0)

    _log("shell_done", {"command": command, "exit_code": exit_code, "ok": ok})
    return _result(
        ok,
        command=command,
        dry_run=False,
        timeout=timeout,
        exit_code=exit_code,
        stdout=stdout_b.decode("utf-8", errors="replace"),
        stderr=stderr_b.decode("utf-8", errors="replace"),
    )


if __name__ == "__main__":
    # Small self-check log
    _log("server_start", {"base_dir": str(BASE_DIR), "dry_run_default": DRY_RUN_DEFAULT, "read_only": READ_ONLY_DEFAULT})
    http_enabled = os.environ.get("ATLAS_BRIDGE_HTTP", "0").lower() in ("1", "true", "yes", "y")
    http_only = os.environ.get("ATLAS_BRIDGE_HTTP_ONLY", "0").lower() in ("1", "true", "yes", "y")
    if http_enabled or http_only:
        port = int(os.environ.get("ATLAS_BRIDGE_HTTP_PORT", "3333"))
        srv = _start_http_adapter(port, background=not http_only)
        if http_only:
            # Run only the HTTP adapter (no stdio MCP server).
            srv.serve_forever()
    mcp.run()
