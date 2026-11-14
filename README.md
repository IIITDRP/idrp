# IDRP

Monorepo for the IIIT Dharwad Research Park website and its backend.

```
idrp/
  idrp-frontend/   Vue 3 + Vite + TypeScript site and admin panel
  idrp-backend/    Spring Boot 4 + PostgreSQL API (Flyway migrations)
  deploy/          VPS deployment kit: nginx, systemd, deploy/rollback/backup scripts, guide
  .github/         CI: backend tests (PostgreSQL via Testcontainers), frontend type-check + build
```

## How the pieces fit

- **Content**: public pages render the bundled snapshot in `idrp-frontend/src/data/*.ts`
  immediately, then replace it with live data from the API. If the API is unreachable the
  snapshot stays on screen (`src/services/contentService.ts`).
- **Single source for content**: edit `src/data/*.ts`, then run `npm run export-seed`; this
  regenerates `idrp-backend/src/main/resources/seed/*.json`, which the backend imports
  when `app.seed-static-data=true`. CI fails if the two drift apart.
- **Forms**: every public form posts to `POST /api/inquiries`; submissions appear in
  **Admin → Inquiries**. Web3Forms is used only if the backend cannot accept the
  submission (`src/services/inquiryService.ts`).
- **Schema**: Flyway owns it (`idrp-backend/src/main/resources/db/migration`); Hibernate only
  validates. Add a new `V<n>__description.sql` for every change.

## Local development

Needs Java 21, Node 22, and Docker (for the tests and the simplest local database).

```bash
# 1. Database (throwaway PostgreSQL 16, same as production)
docker run -d --name idrp-local-db -e POSTGRES_USER=idrp_app -e POSTGRES_PASSWORD=local-dev-only \
  -e POSTGRES_DB=idrp_db -p 127.0.0.1:6543:5432 -v idrp-local-pgdata:/var/lib/postgresql/data postgres:16-alpine

# 2. Backend: copy and fill application.properties (gitignored), then run.
#    First run: add --app.seed-static-data=true to import the site content.
cd idrp-backend
cp src/main/resources/application.properties.example src/main/resources/application.properties
./mvnw spring-boot:run

# 3. Frontend
cd ../idrp-frontend
cp .env.example .env
npm install
npm run dev            # http://localhost:5173, admin at /admin
```

| Command | Where | What |
|---|---|---|
| `./mvnw test` | idrp-backend | All backend tests (starts PostgreSQL in Docker) |
| `npm run build` | idrp-frontend | Sitemap + type-check + production build |
| `npm run export-seed` | idrp-frontend | Regenerate backend seed JSON from `src/data` |

Secrets (DB password, JWT secret) are never committed: `application.properties` and `.env`
are gitignored.

## Deployment

See [deploy/README.md](deploy/README.md).
