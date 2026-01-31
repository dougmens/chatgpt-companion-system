# Copilot Instructions for REACT-UI-Dashboards

## Project Overview
**REACT-UI-Dashboards** is a German-language legal case management dashboard built with React, TypeScript, and Vite. It's a companion app for tracking cases (Rechtsfälle), incidents, and evidence with persistent local storage.

## Architecture

### Core Structure
- **`src/ui/`** – React UI components and views organized by screen
- **`src/model/`** – Type definitions, storage layer, and data derivations
- **`src/views/`** – High-level view components (Master, Cases, Evidence, Archive, Settings)
- **`src/components/`** – Reusable React components (Layout, CompanionReceiver)

### Data Flow Pattern
1. **Store Provider** ([`src/ui/state/Store.tsx`](src/ui/state/Store.tsx)) manages all application state using React Context
2. **Types** ([`src/model/types.ts`](src/model/types.ts)) define domain entities: `CaseItem`, `Incident`, `EvidenceItem`, `ActionLog`
3. **Storage** ([`src/model/storage.ts`](src/model/storage.ts)) persists state to localStorage with key `companion_dashboard_v1`
4. **Views** consume state via `useContext(StoreContext)` and dispatch updates through Store methods

### Navigation Model
Views are centrally defined in [`src/views/viewsOrder.ts`](src/views/viewsOrder.ts) as an array of objects with `key`, `label`, `path`, and `Component`. The Router in [`src/App.tsx`](src/App.tsx) auto-generates routes from this array. **Always update `VIEWS_ORDER` when adding new screens.**

## Key Developer Workflows

### Build & Development
```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Production build to dist/
npm run preview  # Preview built output
```
- Uses **Vite** with React SWC plugin for fast refresh
- Base URL is `/REACT-UI-Dashboards.git/` (see [`vite.config.ts`](vite.config.ts))
- HashRouter for client-side routing (no server config needed)

### Type Safety
- TypeScript 5.5+ with strict checking
- All entities must extend types from `src/model/types.ts`
- Domain values are enums (e.g., `Domain = 'recht' | 'organisation' | 'finanzen' | 'projekt'`)

## Domain-Specific Patterns

### State Updates
State updates happen through Store context methods that:
1. Immutably update the entity
2. Add an `ActionLog` entry if `logText` is provided
3. Persist to localStorage via `saveState()`
4. Trim action logs to max 200 entries ([`Store.tsx` lines 20-26](src/ui/state/Store.tsx#L20-L26))

Example from [`Store.tsx`](src/ui/state/Store.tsx#L40-L54):
```tsx
const updateCase = (caseId: string, updates: Partial<CaseItem>, logText?: string) => {
  const nextCases = state.cases.map((item) =>
    item.id === caseId
      ? { ...item, ...updates, last_update_at: new Date().toISOString() }
      : item
  );
  persist({ ...state, cases: nextCases, logs: addLogEntry(state.logs, ...) });
};
```

### German Localization
The app uses German terminology throughout:
- Enums: `'raeumung'`, `'familie'`, `'bank'`, `'sonstiges'` for case categories
- UI labels: "Rechtsfälle" (Legal Cases), "Beweise" (Evidence), "Archiv"
- Entity fields often German: `domain`, `next_hearing_date`, `counterparty`, `lawyer`

### Data Seeding
Initial demo data is seeded in [`src/model/storage.ts`](src/model/storage.ts) (lines 5-39) with test cases and incidents. The `seedIfEmpty()` function prevents data loss on reset.

## Integration Points

### Companion Receiver
[`src/components/CompanionReceiver.tsx`](src/components/CompanionReceiver.tsx) handles external data injection (likely from a desktop companion app) through `applyCompanionData()` in the Store.

### External Data
Demo data is also available in `public/companion-data.json` for testing companion integration.

## Conventions

- **File naming**: Components use `.tsx`, utilities use `.ts`; duplicate files with " 2" suffix indicate old/backup versions (e.g., [`src/model/types 2.ts`](src/model/types%202.ts)) – **clean these up if modifying core types**
- **Component structure**: Views are stateless consumers of Store context; local UI state is minimal
- **Styling**: Inline styles in Layout; CSS modules in [`src/ui/styles.css`](src/ui/styles.css)
- **Routing**: Always hash-based (`#/path`); add new routes to `VIEWS_ORDER` array

## Critical Files to Know
- [`src/ui/state/Store.tsx`](src/ui/state/Store.tsx) – State logic (all mutations flow here)
- [`src/model/types.ts`](src/model/types.ts) – Domain model (source of truth for entity shapes)
- [`src/views/viewsOrder.ts`](src/views/viewsOrder.ts) – Navigation registry (add screens here)
- [`vite.config.ts`](vite.config.ts) – Base URL and build config
