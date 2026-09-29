# PageBridge — Facebook Page Merge Management Dashboard

PageBridge is a production-oriented TypeScript monorepo for reviewing Facebook Page merge eligibility and handing users to Meta's official merge workflow. It never reads browser cookies, Facebook passwords, or browser session tokens. Google signs users into PageBridge; Meta OAuth separately authorizes Page access.

## Included

- React + Vite + Tailwind responsive SaaS dashboard (dark/light mode)
- Express + TypeScript API, PostgreSQL/Prisma, Redis sessions and BullMQ
- Google OAuth and server-side Meta authorization-code OAuth
- AES-256-GCM encryption of Meta authorization data at rest
- Page sync via `GET /me/accounts` using `pages_show_list`
- Server-side ownership checks, eligibility report, explicit irreversible-action confirmation
- Audit logs, merge history, CSRF, Helmet, HTTP-only sessions, rate limits, Zod validation
- Manifest V3 Chrome/Edge extension using a privacy-safe DOM login indicator and OAuth-style one-time pairing
- Docker Compose, API reference, deployment and extension setup docs

## Important product behavior

The public Graph API does not expose a supported Page-merge endpoint in this implementation. The app therefore never simulates or bypasses a merge. It records the review and opens Meta's official, user-driven workflow, showing: **“Direct API merge is not available. Continue through the official Meta/Facebook workflow.”** Meta makes the final eligibility decision and may not offer merging to every user.

## Quick start

1. Install Node.js 20+, Docker, and npm.
2. Copy `.env.example` to `.env` and replace every placeholder. Generate encryption key with `openssl rand -base64 32`; generate a session secret with `openssl rand -hex 32`.
3. In Google Cloud, register the exact callback in `GOOGLE_CALLBACK_URL`.
4. In Meta for Developers, enable Facebook Login, register the exact `META_CALLBACK_URL`, and request only the permissions you need. `pages_show_list` requires review for live use.
5. Set `META_GRAPH_VERSION` to a currently supported Graph API version after checking the Meta app dashboard. Do not leave `vXX.X`.
6. Start infrastructure and apps:
   ```bash
   docker compose up -d postgres redis
   npm install
   npm run db:generate
   npm run db:migrate
   npm run dev
   ```
7. Open `http://localhost:5173`.

## Meta permissions and data

The app requests `public_profile,email,pages_show_list`. Page sync retrieves the Page name, ID, category, picture, and permitted tasks. Access data is received only by the backend, encrypted before database storage, and never sent to the frontend or extension. Production use may require App Review and business verification.

## Build and test

```bash
npm install
npm run db:generate
npm run typecheck
npm run build
```

## Extension

Read `extension/README.md`. The extension never calls the Graph API and never reads cookies. It locally inspects whether an open `facebook.com` tab looks like a login page, and separately queries the PageBridge API with its own revocable pairing token. These are intentionally distinct statuses.

## Production

Read `docs/DEPLOYMENT.md`, `docs/API.md`, and `docs/SECURITY.md`. HTTPS is mandatory in production. Configure the precise origin allowlists, rotate secrets, run migrations, and complete Google/Meta app verification before live users.

## Official references

- Meta Facebook Login security: https://developers.facebook.com/docs/facebook-login/security/?locale=en_US
- Meta permissions reference: https://developers.facebook.com/docs/permissions/
- Meta Pages API — manage Pages: https://developers.facebook.com/docs/pages-api/manage-pages/?locale=en_US
- Meta Help — Page merges: https://www.facebook.com/help/249601088403018?locale=en_US
