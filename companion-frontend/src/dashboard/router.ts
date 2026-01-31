import type { Intent } from "../chat/intentParser";

export function handleDashboardIntent(intent: Intent) {
  if (intent.type === "SHOW_DASHBOARD") {
    // Prefer local dashboard (can pull data from local atlas-bridge http adapter).
    const companionUrl = encodeURIComponent(
      "http://localhost:3333/dashboard-data?domain=recht"
    );
    const local = `http://localhost:5173/REACT-UI-Dashboards/?companionUrl=${companionUrl}&view=/`;
    window.open(local, "_blank");
  }
}
