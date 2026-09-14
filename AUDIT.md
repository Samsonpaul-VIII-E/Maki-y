# MAKI — Phase 1 Production Audit (Read-Only, No Code Changed)

Date: 2026-09-14 · Scope: entire repository (~9,200 LOC, 16 source files, all read in full)

---

## 1. Architecture Map

```
Browser (React 19 SPA)
├── App.tsx — tab router (no react-router), 13 module views, panic/decoy mode
├── components/ — NavigationHeader, StealthCalculator (real decoy), FeaturesSuiteModal,
│                 SafeErrorBoundary (DEAD — never mounted, has TS errors),
│                 SecurityMatrixBadge (DEAD — never mounted)
├── components/modules/ — 13 modules (236-feature suite)
├── services/
│   ├── makiApi.ts — fetch wrappers for all /api/* + response types
│   ├── securityCore.ts — AES-256-GCM localStorage, sanitizers, client rate limiter,
│   │                     LN address validators (real code, decent quality)
│   ├── cryptoEngine.ts — ghost key (real CSPRNG); Shamir/Kyber/Dilithium (SIMULATIONS)
│   ├── hardwareProfiler.ts — FABRICATED telemetry (battery 91%, temp 38.4°C hardcoded)
│   ├── sound.ts — real WebAudio synthesis; "ultrasonic data relay" claim is fake
│   └── featuresList.ts — static 236-feature catalog claiming ONLINE/ACTIVE for all
└── server.ts (Express, :3000, single origin, no DB, no auth)
    ├── Gemini proxy: /api/maki/{chat,prompt-enhance,vision-analyze,agentic-predict}
    │   └── @google/genai, key server-side (GOOD), model fallback list (NEEDS VERIFICATION)
    ├── /api/lightning/payout — FABRICATES settlement (random preimage/hash, settled:true)
    ├── /api/satoshistream/ads, /api/maki/uncensored-models — static catalogs (real)
    ├── security headers (hand-rolled, mixed quality) + in-memory rate limiter (leaks)
    └── dev: Vite middleware · prod: dist/ static (untested path)
```

Deployment (Base44): node:22-slim, bind-mounted source, `tsx server.ts`, port 3000,
`GEMINI_API_KEY` from managed env. Health: `GET /api/health` → verified working.

---

## 2. Feature Inventory — REAL vs SIMULATED

### Genuinely functional (12)
| Feature | State | Notes |
|---|---|---|
| Gemini chat (3 UIs) | REAL | Server-proxied, key never in browser. No streaming despite claims. |
| Prompt enhancement | REAL | Gemini call with JSON response + fallback parse. |
| Vision analysis (F116) | REAL | Only when an image is uploaded; **error path shows fake "extracted" results**. |
| Agentic draft prediction | REAL | Gemini call; the "local 1B model" version is fake string matching. |
| Image generation | REAL | Via Pollinations.ai (3rd party). Hardcoded publishable key in source + shown in UI. No timeout/error state — `onerror` still calls it success. |
| AES-256-GCM local storage | REAL | PBKDF2-100k + AES-GCM via WebCrypto. Caveat: salt lives in same localStorage → obfuscation, not protection. |
| Ghost key generator | REAL | crypto.getRandomValues; Math.random fallback (weak path). |
| Input sanitization / rate limiting | REAL | Both sides; quality varies (see §3). |
| Sound engine | REAL | WebAudio synth. Ultrasound tone is real; "128-byte handshake broadcast" is fiction. |
| Panic decoy calculator | REAL | Working calculator; unlock code `1337` is printed in the decoy's own footer. |
| Camera pixel filters (F117) | REAL code | **Broken by own `Permissions-Policy: camera=()` header**; falls back to silently faking it. |
| 3D orbit viewer (F119) | REAL code | Drag/orbit math works; it is a 10-point toy, not Gaussian splatting. |

### Simulated / fabricated but presented as real (~200 of 236)
**The critical honesty violations:**

1. **Lightning payouts are fabricated.** `executeLightningPayout()` in server.ts generates a random preimage + SHA-256 pair and returns `settled: true, NO_KYC_ANONYMOUS_SETTLED`. **No sats ever move.** The UI displays "[SETTLEMENT CONFIRMED] +50 SATOSHIS DISPATCHED" and persists a fake sats balance. The server even fetches a REAL LNURL invoice and then ignores it.
2. **Client fabricates success on error.** MakiPublicTerminal's payout `catch` block generates a fake hash/preimage, credits +50 sats, and plays the success chime when the backend FAILS. Image `onerror` does the same ("render success" with a broken URL).
3. **Ghost Mesh** (5 nodes / 250 TOPS / WireGuard / UWB) — hardcoded arrays, no networking exists.
4. **Hardware profiler** — battery, temperature, storage, TOPS are all hardcoded constants shown as "Hardware evaluated at launch".
5. **Shamir 3-of-5 vault** — not Shamir (no reconstruction exists); "reconstruction" reveals a hardcoded string when ≥3 boxes are checked.
6. **Derived Taproot / BIP-352 / silent-payment keys** — hash-sliced fake strings.
7. **Module 1 "EXECUTE LOCAL NPU (0.05s)"** — a `setInterval` progress bar. LoRA/ControlNet/IP-Adapter/Real-ESRGAN are inert toggles.
8. **Module 3** — Secure Enclave/StrongBox, LLVM obfuscation, anti-debug, dead-man's switch: static text. Paper Vault "QR" is an unscannable decorative grid; no scanner exists.
9. **Module 4** — Ghost Fill, voice cloning, lip-sync, manga generator: fake. `.USDZ/.OBJ` export writes an invalid text file with a 3D extension.
10. **Module 5** — the entire Bitcoin stack (BTCPay, Tor, LN invoices, PayJoin, CoinJoin, mempool fees): fake; the ASCII telemetry stream is randomized theater updating every 4.5s forever.
11. **Module 7** — ads, Frenzy mode, Maki Coins, compute harvester, LoRA marketplace: fake.
12. **Module 8** — Kyber/Dilithium functions are honestly named `simulate*`, but the UI claims "256-BIT POST-QUANTUM SECURE"; the zk-SNARK "proof" is a hardcoded string.
13. **Unearned claims baked into the UI**: "Zero-Knowledge", "ZERO LOGGING", "RAM PURGED ON EXIT", "0 SCRIPTS / BLOCKED" (Google Fonts is a third-party fetch), "E2EE", "236/236 ACTIVE", "Verified… Specification", "100% AUDIT PASS".
14. **"PURGE RAM" buttons are no-ops** — `scrubBuffer(string)` returns immediately (JS strings are immutable); every call site passes a string.

---

## 3. Security Findings (ranked)

| # | Severity | Finding | Location |
|---|---|---|---|
| 1 | **CRITICAL (honesty)** | Fake Lightning settlement presented as confirmed payment; client fabricates success on backend error. Fraud-adjacent if any user relies on it. | server.ts `executeLightningPayout`, MakiPublicTerminal catch block |
| 2 | **HIGH** | `/api/maki/*` is an **open Gemini proxy** — no auth; anyone with the URL can burn the API key quota (only IP rate limit: 80/min). | server.ts |
| 3 | **HIGH** | Pollinations publishable key `pk_GErbdeUDEcAlHgAG` committed in source AND displayed in the UI. Should be env config; revocable/abusable. | MakiPublicTerminal (3 places) |
| 4 | **MEDIUM** | `Permissions-Policy: camera=(), microphone=()` **breaks the app's own camera feature**; code then silently fakes the camera feed. | server.ts headers + Module4 |
| 5 | **MEDIUM** | `npm run lint` FAILS — 6 TS errors in SafeErrorBoundary (never type-checked; no CI). | SafeErrorBoundary.tsx |
| 6 | **MEDIUM** | Server rate-limit Map never prunes dead keys → unbounded memory growth. | server.ts `serverRateLimitMap` |
| 7 | **MEDIUM** | CSP uses `'unsafe-inline' 'unsafe-eval'` (needed for Vite dev, weak for prod); `frame-ancestors` still allows `ai.studio`/`google.com`/`run.app` (AI Studio leftover). | server.ts |
| 8 | **MEDIUM** | express 4.22.2 → vulnerable `qs` (moderate DoS, GHSA-x5fp-wj9c-mxmx). `npm audit fix` available. | package.json |
| 9 | **LOW** | `/api/maki/agentic-predict` skips `sanitizeServerText` (every other endpoint sanitizes). | server.ts |
| 10 | **LOW** | Ghost key falls back to `Math.random` if WebCrypto missing. | cryptoEngine.ts |
| 11 | **LOW** | Gemini model fallback list `['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest']` — **model names need verification**; if all invalid, every chat call fails after 3 attempts. | server.ts |
| 12 | **LOW** | No streaming, no request timeout on Gemini calls. | server.ts |
| 13 | **INFO** | Dead code: SafeErrorBoundary + SecurityMatrixBadge never mounted; no error boundary → a module crash = blank page. | src/ |
| 14 | **INFO** | Good: Gemini key is server-side only; no `dangerouslySetInnerHTML` anywhere; React text rendering prevents XSS; BOLT11/LNURL regex validators exist (permissive fallback accepts almost anything `lnbc…`). | — |

---

## 4. Dependency & Build Issues

- **Typecheck broken**: `npx tsc --noEmit` → 6 errors (SafeErrorBoundary). `npm run lint` therefore fails.
- **2 moderate vulnerabilities**: `qs` via `express` (DoS). Fix: `npm audit fix`.
- **package.json hygiene**: `vite` in BOTH dependencies and devDependencies; `@tailwindcss/vite` and `@vitejs/plugin-react` are build tools sitting in `dependencies`; `autoprefixer` appears unused (Tailwind 4 manages prefixes).
- **No tests, no test framework, no CI.** No README. No SECURITY.md.
- **Production build path never validated** (`npm run build` + `NODE_ENV=production` serving is untested).
- **metadata.json** requests camera/microphone frame permissions (AI Studio artifact) that the server's own CSP/Permissions-Policy then blocks.

## 5. Performance

- All 13 modules eagerly imported in App.tsx — no code splitting/lazy loading.
- Module 5 telemetry `setInterval` runs every 4.5s forever once visited (fake data generation cost).
- MakiPublicTerminal ad-timer effect re-creates its interval whenever `generationCredits` changes (minor).
- Pollinations image preloaded with no timeout (can hang the "rendering" state indefinitely).
- Sound plays on every global keydown (default ON).

## 6. UX Problems

- Escape = instant panic swap (excluded only while typing in inputs) — easy accidental trigger.
- Pervasive 9–11px monospace text; contrast okay on green, weak on neutral-400/500.
- No ARIA/focus-trap on modals; custom buttons are plain divs/buttons without labels; no `prefers-reduced-motion` (constant `animate-pulse/ping`).
- Error messages mix in fiction ("Sovereign tunnel delivered local reasoning" on failure).
- Chat lacks streaming, retry, and persistence; image history is memory-only.

---

## 7. Priority Roadmap (proposed Phase 2+ order)

1. **Foundation**: fix the 6 TS errors; mount SafeErrorBoundary; delete or fix dead components; `npm audit fix`; dedupe/move dev deps; add `lint` to a gate.
2. **Config & keys**: move Pollinations key to env/config; verify the 3 Gemini model names against the live API; add timeouts + a single retry to Gemini calls.
3. **Honesty pass (highest product value)**: label every simulated module SIMULATION/DEMO in the UI; remove fake-success-on-error paths (payout catch, image onerror, vision fallback); re-caption "Zero-Knowledge/SETTLEMENT" language; fix "PURGE RAM" no-op claims.
4. **Security hardening**: protect `/api/maki/*` (origin check or shared secret + tighter limits); fix Permissions-Policy/camera contradiction; prune rate-limit map; tighten CSP for production; sanitize `agentic-predict` input.
5. **Core reliability**: image-generation timeout + real error state; chat streaming or at least honest loading; error taxonomy (`{success:false, error:{code,message}}`).
6. **UX/a11y**: reduced-motion support, focus traps, larger minimum text, panic-key confirm.
7. **Performance**: lazy-load modules with React.lazy.
8. **Testing & docs**: vitest + supertest for API/sanitizers/validators; README + SECURITY.md; validate production build.

---

## 8. Verification Commands Used

- `docker compose -f docker-compose.base44.yml up -d --build` → healthy, live dev server
- `curl localhost:3000/api/health` → `{"status":"ok","maki":"online"}`
- `curl localhost:3000/` → Vite dev HTML (live source, not prebuilt)
- `npx tsc --noEmit` → 6 errors (SafeErrorBoundary)
- `npm audit` → 2 moderate (qs via express)
- Full read of all 16 source files; grep for `dangerouslySetInnerHTML` (none), dead-component references (none)
