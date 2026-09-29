# API reference

Base path: `/api`. Browser dashboard requests use the `pb.sid` HTTP-only session cookie. State-changing dashboard requests also require `x-csrf-token`, obtained from `GET /api/csrf`.

## Authentication

- `GET /auth/google` — starts Google OAuth.
- `GET /auth/google/callback` — validates `state`, exchanges the code server-side, upserts the PageBridge user, rotates the session ID.
- `GET /auth/me` — current app user.
- `POST /auth/logout` — destroys the app session.

## Facebook connections

- `GET /facebook/connect` — authenticated app user only; starts Meta OAuth.
- `GET /facebook/callback` — validates `state`, exchanges code server-side, encrypts authorization data.
- `GET /facebook/connections` — safe connection metadata only; never returns tokens.
- `POST /facebook/connections/:id/sync` — calls `GET /me/accounts`, sanitizes returned data, upserts Pages.
- `DELETE /facebook/connections/:id` — removes authorization data and cascaded Page metadata.

## Pages and merge review

- `GET /pages?search=` — Pages owned by the signed-in user.
- `POST /merges/check` — body `{ sourcePageId, destinationPageId }`; verifies ownership server-side, produces a requirement-by-requirement advisory report, stores history.
- `POST /merges/:id/continue` — body `{ confirmed: true }`; requires explicit confirmation and returns only the configured official Meta merge URL. No Graph merge call is attempted.
- `GET /merges/history` — latest 100 merge records.

## Operations

- `GET /app/summary`
- `GET /app/activity`
- `GET /app/notifications`

## Extension pairing

These endpoints do not use Facebook credentials.

- `GET /extension/authorize?redirect_uri=` — app-session protected; validates a `chromiumapp.org` callback against `EXTENSION_IDS`, creates a five-minute one-time code.
- `POST /extension/token` — exchanges the one-time code for a random, hashed-at-rest PageBridge extension token.
- `GET /extension/status` — bearer-token protected connection summary.
- `POST /extension/facebook/disconnect` — revokes/removes the active Meta connection for the paired user; no Facebook browser credential is used.
- `POST /extension/disconnect` — revokes the PageBridge extension token.

Errors use `{ "error": "message" }`. OAuth callback errors may return a minimal HTML/text response because they are browser navigations.
