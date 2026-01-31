import { Outlet, useLocation } from "react-router-dom";
import { VIEWS_ORDER } from "../views";

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "system-ui, Arial" }}>
      <aside style={{ width: 260, padding: 16, background: "#0f172a", color: "white" }}>
        <h2>Companion</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {VIEWS_ORDER.map(v => (
            <li key={v.key}>
              <a href={`#${v.path}`} style={{ color: "white", fontWeight: pathname === v.path ? 700 : 400 }}>
                {v.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>
      <main style={{ flex: 1, padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
