import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { Home, Briefcase, FileText, Archive, Settings } from 'lucide-react';
import { Master } from './screens/Master';
import { Cases } from './screens/Cases';
import { Incidents } from './screens/Incidents';
import { ArchiveView } from './screens/ArchiveView';
import { SettingsView } from './screens/SettingsView';
import { CompanionReceiver } from '../components/CompanionReceiver';

const navItems = [
  { to: '/', label: 'Master', icon: Home },
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
      </aside>
      <main className="content">
        <CompanionReceiver />
        <Routes>
          <Route path="/" element={<Master />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/archive" element={<ArchiveView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </main>
    </div>
  );
};
