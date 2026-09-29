# Security model

## Trust boundaries

Google OAuth authenticates the PageBridge user. Meta OAuth separately authorizes access to managed Pages. One never implies the other. The extension has a third, limited PageBridge pairing token and never receives Meta authorization data.

## Implemented controls

- Server-side authorization-code exchanges; OAuth state validation
- Session ID rotation after login
- Redis-backed, HTTP-only, SameSite=Lax cookies; Secure flag in production
- CSRF token required on state changes
- Helmet security headers, narrow CORS, JSON body limit and rate limiting
- Zod request and environment validation
- Server-side ownership checks on connections, Pages and merge requests
- AES-256-GCM encryption with fresh IV and authentication tag for Meta authorization data
- SHA-256 storage of extension bearer tokens and one-time pair codes
- Five-minute, single-use extension pair codes; allowlisted extension IDs
- 90-day extension token expiry and explicit revocation
- Audit events for authentication, synchronization, eligibility checks and handoffs
- No Facebook cookie permission and no cookie-reading code in the extension
- No frontend localStorage storage of Meta authorization data

## Required production hardening

- Terminate TLS with HSTS and redirect all HTTP traffic to HTTPS.
- Use a managed secret store; never bake `.env` into images.
- Replace application secrets and encryption key through a documented rotation process. Key rotation requires re-encryption or reconnecting affected Meta connections.
- Restrict database and Redis to private networks; enable encryption, backups and access logging.
- Add a Content Security Policy matching the deployed origins.
- Set tight per-route rate limits for OAuth, pairing and Page synchronization.
- Configure Meta deauthorization and data-deletion callbacks before live release.
- Add a retention policy for logs and deleted connections.
- Run dependency, container and SAST scans in CI.
- Keep Graph API version explicit and test before each version upgrade.

## Eligibility scope

Names and categories are advisory signals. Address, Business Manager ownership, primary Page status, global Page status, verification compatibility, regional availability and current Meta product availability must be confirmed by Meta. The UI intentionally marks unprovable conditions **Review Required**.
