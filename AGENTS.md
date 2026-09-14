# Base44 Dev Environment

## Stack
- **Vite 6 + React 19 + Tailwind 4** frontend, served via Vite middleware mode inside an Express server (`server.ts`).
- **Express** API on the same port (3000) — single-origin, no separate API service.
- **Google Gemini API** (`@google/genai`) powers all AI endpoints (`/api/maki/*`).
- No database, no cache, no other infra services.

## Running
```
docker compose -f docker-compose.base44.yml up -d
```
- Node 22-slim image, source bind-mounted at `/app`.
- `npm install` runs on container start, then `npx tsx server.ts` boots the Express+Vite dev server.
- Health check: `GET /api/health` → `{"status":"ok","maki":"online"}`.
- Frontend: `GET /` serves the Vite-dev React app (HMR active).

## Secrets
- `GEMINI_API_KEY` — Google Gemini API key. Required for AI features to actually work; the server boots without it but AI endpoints will error. Get from https://aistudio.google.com/apikey.
- A development placeholder is generated automatically; replace with the real key via the Base44 secrets panel.

## Notes
- The vite.config.ts disables HMR when `DISABLE_HMR=true` (for agent edits). Normal dev leaves it unset.
- `server.ts` creates its own Vite server in middleware mode, so vite.config.ts server options (host/allowedHosts) don't fully apply — Express handles HTTP directly.
