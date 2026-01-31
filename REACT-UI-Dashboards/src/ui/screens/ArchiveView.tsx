import React from 'react';
import { useStore } from '../state/Store';

export const ArchiveView: React.FC = () => {
  const { state } = useStore();
  const archivedCases = state.cases.filter((item) => item.status === 'archiv');
  const archivedIncidents = state.incidents.filter((item) => item.status === 'archiv');

  return (
    <div className="screen">
      <header className="screen-header">
        <h1>Archiv</h1>
        <p>Nur archivierte Fälle und Schäden.</p>
      </header>
      <div className="archive-grid">
        <section className="panel">
          <h2>Fälle</h2>
          {archivedCases.length === 0 && <p className="muted">Keine archivierten Fälle.</p>}
          <ul className="simple-list">
            {archivedCases.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <span className="muted">{item.domain} · {item.category}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel">
          <h2>Schäden</h2>
          {archivedIncidents.length === 0 && <p className="muted">Keine archivierten Schäden.</p>}
          <ul className="simple-list">
            {archivedIncidents.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <span className="muted">{item.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
