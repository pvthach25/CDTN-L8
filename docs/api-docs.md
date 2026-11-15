# BT3 API Documentation - Smart CRM L8 (Track SE)

**Base URL:** `http://localhost:3000`. **Source of truth:** `src/app.js` and `src/routes/*.js` in this submission. There are **16 endpoints**.

**Evidence note:** Examples below are based on the implemented response shapes, not a claim that every example was captured live. The previously observed `/health` response and ticket-409 response are grounded in the user’s API test logs. For full BT3 credit, execute each endpoint and attach its **actual redacted request/response** in `docs/api-evidence/` before final submission. Never commit tokens or passwords.

**Authentication:** Protected endpoints require `Authorization: Bearer <64-character hex token>` obtained from `/api/auth/login`. Token hashes, not raw tokens, are stored in PostgreSQL.

## 01. `GET /`

1. **Method and path:** `GET /`.
2. **Business purpose:** API welcome.
3. **Authentication:** No.
4. **Parameters and request body:** None.
5. **Successful response:** 200 `{"message":"Smart CRM API is running"}`.
6. **Error codes:** 500 unexpected.
7. **Constraints / limitations:** Not a readiness check; use `/health`..

**Example request (command template; replace IDs/credentials with test values):**
```http
GET / HTTP/1.1
Host: localhost:3000
```

**Example response shape (illustrative unless explicitly identified as observed):**
```text
200 `{"message":"Smart CRM API is running"}`
```

## 02. `GET /health`

1. **Method and path:** `GET /health`.
2. **Business purpose:** Database readiness.
3. **Authentication:** No.
4. **Parameters and request body:** None.
5. **Successful response:** 200 `{"status":"ok","database":"connected"}`.
6. **Error codes:** 503 database unavailable.
7. **Constraints / limitations:** Requires a live PostgreSQL connection..

**Example request (command template; replace IDs/credentials with test values):**
```http
GET /health HTTP/1.1
Host: localhost:3000
```

**Example response shape (illustrative unless explicitly identified as observed):**
```text
200 `{"status":"ok","database":"connected"}`
```

## 03. `POST /api/auth/login`

1. **Method and path:** `POST /api/auth/login`.
2. **Business purpose:** Authenticate an application user.
3. **Authentication:** No.
4. **Parameters and request body:** JSON `{"username":"admin","password":"<local password>"}`.
5. **Successful response:** 200 `{ "token":"<redacted>", "expiresAt":"<ISO time>", "user":{"user_id":1,"username":"admin"} }`.
6. **Error codes:** 401 wrong credentials; 500 server error.
7. **Constraints / limitations:** Never include actual tokens or passwords in evidence..

**Example request (command template; replace IDs/credentials with test values):**
```http
POST /api/auth/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json

`{"username":"admin","password":"<local password>"}`
```

**Example response shape (illustrative unless explicitly identified as observed):**
```text
200 `{ "token":"<redacted>", "expiresAt":"<ISO time>", "user":{"user_id":1,"username":"admin"} }`
```

## 04. `GET /api/auth/me`

1. **Method and path:** `GET /api/auth/me`.
2. **Business purpose:** Get current session identity.
3. **Authentication:** Bearer.
4. **Parameters and request body:** None.
5. **Successful response:** 200 `{"user_id":1,"username":"admin"}`.
6. **Error codes:** 401 missing/expired token; 500 server error.
7. **Constraints / limitations:** Sessions expire after eight hours..

**Example request (command template; replace IDs/credentials with test values):**
```http
GET /api/auth/me HTTP/1.1
Host: localhost:3000
Authorization: Bearer <REDACTED_TEST_TOKEN>
```

**Example response shape (illustrative unless explicitly identified as observed):**
```text
200 `{"user_id":1,"username":"admin"}`
```

## 05. `POST /api/auth/logout`

1. **Method and path:** `POST /api/auth/logout`.
2. **Business purpose:** Invalidate current token.
3. **Authentication:** Bearer.
4. **Parameters and request body:** None.
5. **Successful response:** 200 `{"message":"Dang xuat thanh cong"}`.
6. **Error codes:** 401 missing/expired token; 500 server error.
7. **Constraints / limitations:** Logout invalidates only the supplied token..

**Example request (command template; replace IDs/credentials with test values):**
```http
POST /api/auth/logout HTTP/1.1
Host: localhost:3000
Authorization: Bearer <REDACTED_TEST_TOKEN>
```

**Example response shape (illustrative unless explicitly identified as observed):**
```text
200 `{"message":"Dang xuat thanh cong"}`
```

## 06. `GET /api/tickets`

1. **Method and path:** `GET /api/tickets`.
2. **Business purpose:** List all tickets.
3. **Authentication:** Bearer.
4. **Parameters and request body:** None.
5. **Successful response:** 200 array of ticket records.
6. **Error codes:** 401 missing/expired token; 500 server error.
7. **Constraints / limitations:** Ticket list is not owner-scoped in this prototype..

**Example request (command template; replace IDs/credentials with test values):**
```http
GET /api/tickets HTTP/1.1
Host: localhost:3000
Authorization: Bearer <REDACTED_TEST_TOKEN>
```

**Example response shape (illustrative unless explicitly identified as observed):**
```text
200 array of ticket records
```

## 07. `GET /api/tickets/available`

1. **Method and path:** `GET /api/tickets/available`.
2. **Business purpose:** List CLOSED tickets without a survey.
3. **Authentication:** Bearer.
4. **Parameters and request body:** None.
5. **Successful response:** 200 array of available tickets.
6. **Error codes:** 401 missing/expired token; 500 server error.
7. **Constraints / limitations:** Excludes tickets with an existing survey..

**Example request (command template; replace IDs/credentials with test values):**
```http
GET /api/tickets/available HTTP/1.1
Host: localhost:3000
Authorization: Bearer <REDACTED_TEST_TOKEN>
```

**Example response shape (illustrative unless explicitly identified as observed):**
```text
200 array of available tickets
```

## 08. `GET /api/tickets/:id`

1. **Method and path:** `GET /api/tickets/:id`.
2. **Business purpose:** Read ticket by ID.
3. **Authentication:** Bearer.
4. **Parameters and request body:** Path `id` positive integer.
5. **Successful response:** 200 ticket record.
6. **Error codes:** 400 invalid ID; 404 missing ticket; 401 unauthenticated.
7. **Constraints / limitations:** Ticket records are shared across authenticated users..

**Example request (command template; replace IDs/credentials with test values):**
```http
GET /api/tickets/1 HTTP/1.1
Host: localhost:3000
Authorization: Bearer <REDACTED_TEST_TOKEN>
```

**Example response shape (illustrative unless explicitly identified as observed):**
```text
200 ticket record
```

## 09. `POST /api/tickets`

1. **Method and path:** `POST /api/tickets`.
2. **Business purpose:** Create ticket.
3. **Authentication:** Bearer.
4. **Parameters and request body:** JSON `{"customer_id":1,"technician_id":1,"center_id":1,"status":"OPEN"}`.
5. **Successful response:** 201 ticket record including generated `ticket_id`.
6. **Error codes:** 400 invalid ID/status/date; 401 unauthenticated; 500 DB error.
7. **Constraints / limitations:** CLOSED requires valid `closed_at`; OPEN/IN_PROGRESS must not provide one..

**Example request (command template; replace IDs/credentials with test values):**
```http
POST /api/tickets HTTP/1.1
Host: localhost:3000
Authorization: Bearer <REDACTED_TEST_TOKEN>
Content-Type: application/json

`{"customer_id":1,"technician_id":1,"center_id":1,"status":"OPEN"}`
```

**Example response shape (illustrative unless explicitly identified as observed):**
```text
201 ticket record including generated `ticket_id`
```

## 10. `PUT /api/tickets/:id`

1. **Method and path:** `PUT /api/tickets/:id`.
2. **Business purpose:** Update ticket.
3. **Authentication:** Bearer.
4. **Parameters and request body:** Path ID; partial JSON e.g. `{"status":"IN_PROGRESS"}`.
5. **Successful response:** 200 updated ticket record.
6. **Error codes:** 400 invalid input; 404 missing; 409 surveyed ticket cannot reopen; 401 unauthenticated.
7. **Constraints / limitations:** Surveyed tickets cannot transition away from CLOSED..

**Example request (command template; replace IDs/credentials with test values):**
```http
PUT /api/tickets/1 HTTP/1.1
Host: localhost:3000
Authorization: Bearer <REDACTED_TEST_TOKEN>
```

**Example response shape (illustrative unless explicitly identified as observed):**
```text
200 updated ticket record
```

## 11. `DELETE /api/tickets/:id`

1. **Method and path:** `DELETE /api/tickets/:id`.
2. **Business purpose:** Delete ticket without survey.
3. **Authentication:** Bearer.
4. **Parameters and request body:** Path ID.
5. **Successful response:** 200 deleted ticket record.
6. **Error codes:** 400 invalid ID; 404 missing; 409 ticket has survey; 401 unauthenticated.
7. **Constraints / limitations:** Deletion of surveyed tickets is blocked..

**Example request (command template; replace IDs/credentials with test values):**
```http
DELETE /api/tickets/1 HTTP/1.1
Host: localhost:3000
Authorization: Bearer <REDACTED_TEST_TOKEN>
```

**Example response shape (illustrative unless explicitly identified as observed):**
```text
200 deleted ticket record
```

## 12. `GET /api/survey-responses`

1. **Method and path:** `GET /api/survey-responses`.
2. **Business purpose:** List surveys owned by current user.
3. **Authentication:** Bearer.
4. **Parameters and request body:** None.
5. **Successful response:** 200 array of survey records for current user.
6. **Error codes:** 401 unauthenticated; 500 server error.
7. **Constraints / limitations:** Other users’ survey rows are excluded..

**Example request (command template; replace IDs/credentials with test values):**
```http
GET /api/survey-responses HTTP/1.1
Host: localhost:3000
Authorization: Bearer <REDACTED_TEST_TOKEN>
```

**Example response shape (illustrative unless explicitly identified as observed):**
```text
200 array of survey records for current user
```

## 13. `GET /api/survey-responses/:id`

1. **Method and path:** `GET /api/survey-responses/:id`.
2. **Business purpose:** Read own survey.
3. **Authentication:** Bearer.
4. **Parameters and request body:** Path `id` positive integer.
5. **Successful response:** 200 survey record.
6. **Error codes:** 400 invalid ID; 404 missing or not owned; 401 unauthenticated.
7. **Constraints / limitations:** Returns 404 for non-owner to avoid existence disclosure..

**Example request (command template; replace IDs/credentials with test values):**
```http
GET /api/survey-responses/1 HTTP/1.1
Host: localhost:3000
Authorization: Bearer <REDACTED_TEST_TOKEN>
```

**Example response shape (illustrative unless explicitly identified as observed):**
```text
200 survey record
```

## 14. `POST /api/survey-responses`

1. **Method and path:** `POST /api/survey-responses`.
2. **Business purpose:** Create a survey for a CLOSED ticket.
3. **Authentication:** Bearer.
4. **Parameters and request body:** JSON `{"ticket_id":2,"csat_score":5,"nps_score":9,"comment":"OK"}`.
5. **Successful response:** 201 survey record.
6. **Error codes:** 400 invalid score or OPEN ticket; 404 unknown ticket; 409 duplicate ticket; 401 unauthenticated.
7. **Constraints / limitations:** Only one survey per ticket, enforced by UNIQUE. Owner set from token, not client JSON..

**Example request (command template; replace IDs/credentials with test values):**
```http
POST /api/survey-responses HTTP/1.1
Host: localhost:3000
Authorization: Bearer <REDACTED_TEST_TOKEN>
Content-Type: application/json

`{"ticket_id":2,"csat_score":5,"nps_score":9,"comment":"OK"}`
```

**Example response shape (illustrative unless explicitly identified as observed):**
```text
201 survey record
```

## 15. `PUT /api/survey-responses/:id`

1. **Method and path:** `PUT /api/survey-responses/:id`.
2. **Business purpose:** Update own survey.
3. **Authentication:** Bearer.
4. **Parameters and request body:** Path ID; JSON `{"csat_score":4,"nps_score":8,"comment":"Updated"}`.
5. **Successful response:** 200 updated survey record.
6. **Error codes:** 400 invalid input; 404 missing or not owned; 401 unauthenticated.
7. **Constraints / limitations:** All score fields are required on update..

**Example request (command template; replace IDs/credentials with test values):**
```http
PUT /api/survey-responses/1 HTTP/1.1
Host: localhost:3000
Authorization: Bearer <REDACTED_TEST_TOKEN>
```

**Example response shape (illustrative unless explicitly identified as observed):**
```text
200 updated survey record
```

## 16. `DELETE /api/survey-responses/:id`

1. **Method and path:** `DELETE /api/survey-responses/:id`.
2. **Business purpose:** Delete own survey.
3. **Authentication:** Bearer.
4. **Parameters and request body:** Path ID.
5. **Successful response:** 200 deleted survey record.
6. **Error codes:** 400 invalid ID; 404 missing or not owned; 401 unauthenticated.
7. **Constraints / limitations:** Deletes only surveys owned by authenticated user..

**Example request (command template; replace IDs/credentials with test values):**
```http
DELETE /api/survey-responses/1 HTTP/1.1
Host: localhost:3000
Authorization: Bearer <REDACTED_TEST_TOKEN>
```

**Example response shape (illustrative unless explicitly identified as observed):**
```text
200 deleted survey record
```

## Capturing real examples

Use a disposable Docker test environment. For each endpoint, record the HTTP method, URL, redacted request body, HTTP status and actual response body. Save to `docs/api-evidence/` and link from the relevant endpoint section. Use the same account for owner-only survey operations. For the A01 test, create a second user and confirm that the second user receives HTTP 404 for a survey created by the first.

Observed evidence already supplied in conversation: GET `/health` -> `{"status":"ok","database":"connected"}`; PUT `/api/tickets/1` reopening surveyed ticket -> HTTP 409 `{"error":"Khong the thay doi trang thai ticket da co khao sat"}` after BUG-01 fix.
