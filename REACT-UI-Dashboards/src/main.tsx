import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { CompanionReceiver } from "./components/CompanionReceiver";
import { App as DashboardApp } from "./ui/App";
import { StoreProvider } from "./ui/state/Store";
import "./ui/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <HashRouter>
        <CompanionReceiver />
        <DashboardApp />
      </HashRouter>
    </StoreProvider>
  </React.StrictMode>
);
