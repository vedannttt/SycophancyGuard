# SycophancyGuard

React + TypeScript + Vite + Tailwind frontend for explainable sycophancy detection. No backend.

## Run
npm install
npm run dev

## Architecture
- src/components/layout/Layout.tsx
- src/lib/db.ts Dexie IndexedDB
- src/lib/classify.ts feature-based baseline hybrid detector (not trained ML)
- Pages cover ChatLab, analysis, research, comparison, datasets, explainability, evaluation, reports, settings.

## Notes
Offline demo mode only until a provider is configured. No fake metrics. Credentials session-only.
