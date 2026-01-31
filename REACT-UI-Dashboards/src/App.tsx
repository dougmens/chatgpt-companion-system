import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { VIEWS_ORDER } from "./views";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to={VIEWS_ORDER[0].path} replace />} />
        {VIEWS_ORDER.map((v) => (
          <Route key={v.key} path={v.path} element={<v.Component />} />
        ))}
        <Route path="*" element={<Navigate to={VIEWS_ORDER[0].path} replace />} />
      </Route>
    </Routes>
  );
}
