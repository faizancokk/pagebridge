# Architecture

```text
Browser dashboard ── app session + CSRF ──> Express API ──> PostgreSQL
                                              │    └──────> Redis sessions
                                              ├───────────> BullMQ page-sync queue/worker
                                              ├─ server-side OAuth ───────> Google
                                              └─ server-side OAuth/API ──> Meta

Chrome/Edge extension ── PageBridge token ──> Extension API
        └─ local DOM indicator only ────────> open facebook.com tabs
```

The API is organized by route, service, middleware, job and infrastructure layers. Facebook-specific operations are isolated behind `services/meta.ts`; additional supported automation can be added as new services and routes without changing Google login, session management, encryption, ownership checks or the dashboard shell.

## Data flow

1. Google OAuth creates/updates `User` and rotates the PageBridge session.
2. Meta OAuth stores only an encrypted server-side authorization payload in `FacebookConnection`.
3. A sync job retrieves `/me/accounts`, strips authorization fields, and persists Page metadata/tasks.
4. Eligibility accepts internal Page IDs, then re-resolves both Pages through the current user's connection on the server.
5. The report distinguishes hard failures from facts that Meta must review.
6. Confirmation records a handoff and returns the configured official Meta URL. No undocumented merge call is made.

## Extension isolation

The extension's bearer token authorizes only the extension status surface. It cannot retrieve Meta access tokens or Page data. Tokens are random, hashed in PostgreSQL, expire after 90 days, and are revocable. Pair codes are single-use and valid for five minutes.
