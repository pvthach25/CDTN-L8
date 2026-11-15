# BT3 Security Self-Assessment - Smart CRM L8

Values are **ĐÃ LÀM** (implemented), **CHƯA LÀM** (not implemented or not verified), and **KHÔNG ÁP DỤNG** (not applicable). Do not change a status without running its stated check.

| # | Requirement | Status | Concrete evidence / limitation |
|---|---|---|---|
| 1 | No actual secrets committed to repository or Git history | ĐÃ LÀM (local review) | `.gitignore` excludes `.env`; `git ls-files .env` and `git log --all -- .env` returned no tracked `.env` in the supplied archive. `.env.example` contains public demo placeholders only. Run `git log --all -- .env` again on the final remote. |
| 2 | Application-level input validation | ĐÃ LÀM | `src/services/ticketService.js` validates status/date/IDs; `src/services/surveyResponseService.js` validates CSAT 1–5, NPS 0–10, comment type and CLOSED-only rule; unit tests cover invalid inputs. |
| 3 | Ownership-based authorization | CHƯA LÀM (partial) | Survey endpoints now scope rows by `owner_user_id` (`surveyResponseRepository.js`, `surveyResponseRoutes.js`); four unit tests PASS. **A real two-user API test is still required**, and ticket endpoints are not owner-scoped. |
| 4 | Passwords and sensitive tokens stored hashed | ĐÃ LÀM | `authService.js` uses `crypto.scryptSync` with random salt for passwords and SHA-256 hashes session tokens; database columns are `password_hash` and `token_hash`. |
| 5 | API errors do not reveal stack traces, table names or connection strings | ĐÃ LÀM (API response) | `authRoutes.js`, `ticketRoutes.js`, `surveyResponseRoutes.js` and global middleware return generic 500 messages; inspect the response body during an error. Server-side logs still contain errors for debugging. |
| 6 | Logs do not disclose unnecessary personal data or secrets | CHƯA LÀM (not audited) | `console.error(error)` remains in route handlers. Audit production logging/redaction before claiming compliance. Do not photograph login tokens. |
| 7 | Dependencies pinned and vulnerability warnings checked | CHƯA LÀM (partial) | `package-lock.json` and `frontend/package-lock.json` exist and Dockerfiles use `npm ci`; run `docker compose exec app npm audit --omit=dev` and inspect results before changing this to ĐÃ LÀM. Image tags are major-version based rather than immutable digests. |

**Security scope:** Prototype intended for local classroom demonstration. No penetration test or production security audit is claimed. Demo credentials in `.env.example` must be changed before any external deployment.
