import Master from "./Master";
import Cases from "./Cases";
import Evidence from "./Evidence";
import Archive from "./Archive";
import Settings from "./Settings";

export const VIEWS_ORDER = [
  { key: "master", label: "Master", path: "/master", Component: Master },
  { key: "cases", label: "Rechtsfälle", path: "/cases", Component: Cases },
  { key: "evidence", label: "Beweise", path: "/evidence", Component: Evidence },
  { key: "archive", label: "Archiv", path: "/archive", Component: Archive },
  { key: "settings", label: "Einstellungen", path: "/settings", Component: Settings },
];
