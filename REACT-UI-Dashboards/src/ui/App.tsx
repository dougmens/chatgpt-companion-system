import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { Home, Briefcase, FileText, Archive, Settings, CalendarClock } from 'lucide-react';
import { Master } from './screens/Master';
import { Cases } from './screens/Cases';
import { Incidents } from './screens/Incidents';
import { Deadlines } from './screens/Deadlines';
import { ArchiveView } from './screens/ArchiveView';
import { SettingsView } from './screens/SettingsView';
import { McpStatus } from './components/McpStatus';

const navItems = [
  { to: '/', label: 'Übersicht', icon: Home },
  { to: '/deadlines', label: 'Fristen', icon: CalendarClock },
  { to: '/cases', label: 'Rechtsfälle', icon: Briefcase },
  { to: '/incidents', label: 'Schäden & Beweise', icon: FileText },
  { to: '/archive', label: 'Archiv', icon: Archive },
  { to: '/settings', label: 'Einstellungen', icon: Settings },
];

export const App: React.FC = () => {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-title">Companion-System</span>
          <span className="brand-sub">ADHS-freundlich</span>
        </div>
        <nav className="nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link${isActive ? ' nav-link-active' : ''}`
                }
                end={item.to === '/'}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <McpStatus />
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Master />} />
          <Route path="/deadlines" element={<Deadlines />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/archive" element={<ArchiveView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </main>
    </div>
  );
};
