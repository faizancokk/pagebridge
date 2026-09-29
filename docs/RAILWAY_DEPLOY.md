# Deploying PageBridge on Railway

This guide deploys the full stack (API + worker + web + PostgreSQL + Redis)
on [Railway](https://railway.app). Railway's trial gives a **$5 one-time
credit (no credit card)** — enough to test for a few weeks. Running 24/7
after the trial needs the Hobby plan (~$5/month).

## Architecture on Railway

| Service  | Source                    | Notes |
|----------|---------------------------|-------|
| postgres | Railway plugin            | Managed PostgreSQL |
| redis    | Railway plugin            | Managed Redis |
| api      | `apps/api/Dockerfile`     | Runs Prisma migrations, then `node dist/index.js` |
| worker   | `apps/api/Dockerfile`     | Same image, start command overridden to `node dist/worker.js` |
| web      | `apps/web/Dockerfile`     | nginx serving the Vite build |

## Step 1 — Push the project to GitHub

```bash
cd pagebridge
git init
git add .
git commit -m "PageBridge v1"
gh repo create pagebridge --private --source=. --push
```

(Railway deploys from GitHub. Keep the repo private; never commit a real
`.env` — only `.env.example` belongs in git.)

## Step 2 — Create the Railway project

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → select `pagebridge`.
2. Add plugins: **+ New** → **Database** → **PostgreSQL**, then **+ New** → **Database** → **Redis**.

## Step 3 — Create the `api` service

1. **+ New** → **GitHub Repo** → same repo → set **Dockerfile Path** to `apps/api/Dockerfile`.
2. In the service → **Variables**, add:

```
NODE_ENV=production
WEB_URL=https://<web-service>.up.railway.app        # fill after Step 5
API_URL=https://<api-service>.up.railway.app        # this service's own domain
DATABASE_URL=${{postgres.DATABASE_URL}}
REDIS_URL=${{redis.REDIS_URL}}
SESSION_SECRET=<openssl rand -base64 48>
TOKEN_ENCRYPTION_KEY=<openssl rand -base64 32>      # exactly 32 bytes
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
GOOGLE_CALLBACK_URL=https://<api-service>.up.railway.app/api/auth/google/callback
META_APP_ID=<from Meta developers.facebook.com>
META_APP_SECRET=<from Meta developers.facebook.com>
META_CALLBACK_URL=https://<api-service>.up.railway.app/api/facebook/callback
META_GRAPH_VERSION=v21.0
META_OFFICIAL_MERGE_URL=https://www.facebook.com/help/...
```

Generate secrets locally (never reuse the dev `.env` values):

```bash
openssl rand -base64 48   # SESSION_SECRET
openssl rand -base64 32   # TOKEN_ENCRYPTION_KEY (32 bytes)
```

3. **Settings** → **Networking** → **Generate Domain**. Copy it as `<api-service>.up.railway.app` and fill `API_URL` above.
4. Deploy. The container runs `prisma migrate deploy` automatically on
   first start, then launches the API. Check **Deployments** → logs for
   `PageBridge API on :<PORT>`.

## Step 4 — Create the `worker` service

1. Same repo, **Dockerfile Path** `apps/api/Dockerfile` again.
2. **Settings** → override the start command: `node dist/worker.js`
   (this replaces the Dockerfile CMD, so no migration runs here).
3. Copy the **same Variables** as the `api` service (`DATABASE_URL`,
   `REDIS_URL`, `TOKEN_ENCRYPTION_KEY`, …). No public domain needed.
4. Deploy and confirm the worker connects to Redis in the logs.

## Step 5 — Create the `web` service

1. Same repo, **Dockerfile Path** `apps/web/Dockerfile`.
2. **Variables** → add:

```
VITE_API_URL=https://<api-service>.up.railway.app
```

Railway exposes variables at build time, so the Vite build bakes in the
API URL. (Changing it later requires a redeploy of `web`.)

3. **Settings** → **Networking** → **Generate Domain** → this is your
   public dashboard URL: `https://<web-service>.up.railway.app`.
4. Go back to the `api` service and set `WEB_URL` to that domain, then
   redeploy `api` (CORS and post-login redirects depend on it).

## Step 6 — Register OAuth callbacks

- **Google Cloud Console** → Credentials → your Web OAuth client →
  Authorized redirect URIs → add
  `https://<api-service>.up.railway.app/api/auth/google/callback`
- **Meta developers.facebook.com** → your app → Facebook Login settings →
  Valid OAuth Redirect URIs → add
  `https://<api-service>.up.railway.app/api/facebook/callback`

## Step 7 — Smoke test

1. Open the web domain → **Continue with Google** → you land on the dashboard.
2. **Connect Facebook** → Meta's official OAuth → Pages sync.
3. Pick Source/Destination Pages → eligibility checker shows pass/review/fail.
4. Merge History and Activity Logs record the check.

## Notes & limits

- Railway's free **$1/month** plan credit does not cover API + worker +
  Postgres + Redis running 24/7. Budget for Hobby (~$5/month) after the
  $5 trial credit.
- Never put real secrets in git. Rotate `SESSION_SECRET` /
  `TOKEN_ENCRYPTION_KEY` if they were ever committed or shared.
- `TOKEN_ENCRYPTION_KEY` must decode from base64 to exactly 32 bytes or
  the API refuses to start.
- The app performs **no direct Page merge via API** (Meta offers no public
  endpoint). The merge flow always hands off to Meta's official workflow
  with explicit user confirmation — see `docs/SECURITY.md`.
