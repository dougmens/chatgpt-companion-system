import React from 'react';
import { useStore } from '../state/Store';

export const SettingsView: React.FC = () => {
  const { resetDemo } = useStore();

  return (
    <div className="screen">
      <header className="screen-header">
        <h1>Einstellungen</h1>
        <p>Nur lokale Datenverwaltung.</p>
      </header>
      <section className="panel">
        <h2>Demo-Daten</h2>
        <p>Setzt alle lokalen Daten auf den Ausgangszustand zurück.</p>
        <button className="primary" onClick={() => resetDemo()}>
          Demo zurücksetzen
        </button>
      </section>
    </div>
  );
};
