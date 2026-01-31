import React, { useEffect } from 'react';
import { useStore } from '../ui/state/Store';

const tryParseBase64 = (s: string) => {
  try {
    const decoded = atob(s);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const CompanionReceiver: React.FC = () => {
  const { applyCompanionData } = useStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const b64 = params.get('companion');
    const url = params.get('companionUrl');
    const file = params.get('companionFile');
    const view = params.get('view');

    const apply = async () => {
      if (b64) {
        const parsed = tryParseBase64(b64);
        if (parsed) {
          applyCompanionData(parsed);
        }
      } else if (url) {
        try {
          const res = await fetch(url);
          const json = await res.json();
          applyCompanionData(json);
        } catch (e) {
          // ignore
        }
      } else if (file) {
        try {
          const res = await fetch('/' + file);
          const json = await res.json();
          applyCompanionData(json);
        } catch (e) {
          // ignore
        }
      }

      if (view) {
        try {
          const next = new URL(window.location.href);
          next.searchParams.delete('companion');
          next.searchParams.delete('companionUrl');
          next.searchParams.delete('companionFile');
          next.searchParams.delete('view');
          window.history.replaceState({}, '', next.toString());
          // navigate by hash or queryless path is left to router
          if (view.startsWith('/')) {
            window.location.hash = view;
          } else {
            window.location.hash = view;
          }
        } catch {}
      }
    };

    apply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
