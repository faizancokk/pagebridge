# Production deployment

## 1. Provision

Create PostgreSQL 16 and Redis 7 in a private network. Deploy API and web containers behind an HTTPS reverse proxy. Use distinct production domains such as `app.example.com` and `api.example.com`; update `WEB_URL`, `API_URL`, OAuth callbacks and CORS accordingly.

## 2. Secrets and environment

Copy `.env.example` only as a template. Store actual values in the platform's secret manager. Generate independent high-entropy session and encryption secrets. Set a current, supported `META_GRAPH_VERSION`; the example deliberately uses `vXX.X` so deployment cannot silently pin an unverified version.

## 3. OAuth consoles

Google: create a Web application OAuth client and allow only the exact production callback.

Meta: enable the appropriate Facebook Login use case, allow only the exact callback, configure allowed domains, privacy policy, data deletion and deauthorization endpoints, and submit `pages_show_list` for App Review if required. Request no permission without a working feature and review justification.

## 4. Database and service launch

```bash
npm ci
npm run db:generate
npx prisma migrate deploy --schema apps/api/prisma/schema.prisma
npm run build
NODE_ENV=production npm run start -w @pagebridge/api
```

The included Compose file is a deployment baseline, not a complete public-edge stack. Put it behind managed TLS, monitoring and backups.

## 5. Extension release

Set production URLs in `extension/src/config.js`, narrow `host_permissions` to the exact API origin, package the folder, then add its final store/runtime ID to `EXTENSION_IDS`. Test pairing, revocation and expiration. Complete the store privacy form accurately; explain the local Facebook login-page indicator.

## 6. Smoke tests

1. Google login creates a fresh secure session.
2. A different app user cannot access another user's connections or Pages.
3. Meta connect stores no token in browser storage, HTML, logs or API responses.
4. Page sync handles an expired/revoked token with reconnect guidance.
5. CSRF-free mutations return 403.
6. Selecting one Page twice is rejected.
7. Unprovable merge conditions are Review Required, not falsely Eligible.
8. Continue requires `{ confirmed: true }` and opens only `META_OFFICIAL_MERGE_URL`.
9. Extension pairing rejects unallowlisted IDs, reused codes and expired codes.
10. Disconnect revokes the extension token and Facebook disconnect removes encrypted authorization data.

## 7. Operations

Monitor OAuth errors, Graph errors, 429s, sync latency and database health. Never log authorization headers or decrypted token payloads. On Meta permission or API changes, disable affected functionality safely and update the eligibility explanation before redeploying.
