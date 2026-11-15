# Deployment Guide - Smart CRM L8 (SE) - BT3

## 1. Environment requirements
- **Operating systems:** Windows 10/11 with PowerShell 5.1+; or Linux/macOS with a shell.
- **Software:** Docker Desktop with Docker Compose v2 (or Docker Engine + Compose plugin) and Git. Node.js and PostgreSQL are **not required on the host**.
- **Resources:** At least 4 GB available RAM and 2 GB free disk space are recommended for this prototype.
- **Free TCP ports:** 3000 (Express API) and 5173 (React/Vite frontend). PostgreSQL is reachable only inside the Compose network.
- **Images:** Node 22 Alpine (backend/frontend), PostgreSQL 17 Alpine.
- **Security:** This is a local demonstration, not a public production deployment. The example credentials in `.env.example` are **public demo values**, not private secrets. Replace them before use beyond localhost.

## 2. Reproduce from a clean clone (two setup commands)
First, clone the **v1.0** tag into an empty directory. This is a source retrieval step, not an application setup command:

```powershell
git clone --branch v1.0 https://github.com/pvthach25/CDTN-L8.git CDTN-L8-BT3
cd CDTN-L8-BT3
```

Then execute exactly these **two setup commands** in PowerShell:

```powershell
Copy-Item .env.example .env
docker compose up -d --build
```

On Linux/macOS, use `cp .env.example .env` as the first setup command. Compose starts PostgreSQL, applies the SQL schema and sample data on a **new** volume, starts the API, creates the demo administrator if missing, and starts the frontend. The API bootstrap assigns legacy sample surveys to that administrator. All three services have healthchecks.

**Demo sign-in (localhost only):** `ADMIN_USERNAME` and `ADMIN_PASSWORD` are the values in the copied `.env` file. Do not publish a real password in screenshots. If using an **existing** database volume, the bootstrap does not overwrite the password of an existing admin; sign in with that account's existing password or rotate it with `scripts/create-admin.js`.

## 3. Environment variables
| Variable | Purpose | Example | Required? |
|---|---|---|---|
| `PORT` | Express API listening port inside the container | `3000` | Optional (default 3000) |
| `POSTGRES_DB` | PostgreSQL database name | `smart_crm_l8` | Yes |
| `POSTGRES_USER` | PostgreSQL role | `smartcrm` | Yes |
| `POSTGRES_PASSWORD` | PostgreSQL password (demo placeholder only) | `change_me` | Yes |
| `DATABASE_URL` | Connection URI for manual execution outside Compose; Compose constructs its own internal URI | `postgresql://smartcrm:change_me@db:5432/smart_crm_l8` | Only outside Compose |
| `ADMIN_USERNAME` | Bootstrap admin account name | `admin` | Yes for automatic sign-in setup |
| `ADMIN_PASSWORD` | Bootstrap admin password; minimum 12 characters | `DEMO_ONLY_CHANGE_BEFORE_DEPLOY_2026` | Yes for automatic sign-in setup |

**Do not commit `.env`**. The example credentials are intentionally non-secret demonstration placeholders. Use unique passwords before sharing a deployment.

## 4. Sample data and initialization
For a **new database volume**, Compose mounts these SQL files in order:
1. `database/migrations/001_create_tables.sql` (business tables);
2. `database/migrations/002_create_auth_tables.sql` (authentication tables);
3. `database/migrations/003_add_survey_owner.sql` (survey ownership column);
4. `database/seeds/001_seed_data.sql` (one sample customer, service center, technician, CLOSED ticket and survey).

The app bootstrap inserts one administrator only if it does not already exist, then assigns the legacy sample survey to that administrator. Initial counts should be **1** for each of `customer`, `service_center`, `technician`, `ticket`, `survey_response` and `app_user`; `auth_session` is **0** until sign-in. The schema has **7 tables**. Data is stored in the named `postgres_data` volume. On subsequent starts, initialization scripts are not rerun and seed rows must not duplicate.

## 5. Verify a successful deployment
Execute the following checks **after** the two setup commands:

```powershell
docker compose ps
Invoke-RestMethod http://localhost:3000/health
docker compose exec app npm test
```

Expected: `db`, `app` and `frontend` show **healthy**; `/health` returns `status=ok` and `database=connected`; unit tests report **25 PASS / 0 FAIL**. Open `http://localhost:5173`, sign in with the local demo account, and confirm the seeded survey appears in the list/detail view.

To verify seed counts:

```powershell
docker compose exec db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT (SELECT COUNT(*) FROM ticket) AS tickets, (SELECT COUNT(*) FROM survey_response) AS surveys;"'
```

On an untouched new volume, the expected output is `tickets=1`, `surveys=1`. Re-run `docker compose up -d --build` and verify the counts remain unchanged. This is the **second-run reproducibility** check.

To stop containers without deleting data:

```powershell
docker compose down
```

For an **isolated disposable** test stack, run:

```powershell
docker compose -p smartcrm_bt3_clean -f compose.yaml -f compose.clean-test.yaml up -d --build
```

This uses API port **3002** and frontend port **5175**. To destroy **only this test volume**, run `docker compose -p smartcrm_bt3_clean -f compose.yaml -f compose.clean-test.yaml down -v`. **Never run `down -v` on the primary stack if its data must be retained.**

**Known limitations:** The owner-scope protection covers survey API records; ticket endpoints remain shared among authenticated users and should be restricted further for a multi-tenant production system. This prototype does not implement rate limiting, TLS termination or CI/CD.
