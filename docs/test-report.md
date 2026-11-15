# BT3 Test Report - Smart CRM L8 (SE)

**Execution status (15 November 2026).** The author previously supplied screenshots for TC01-TC10. Their exact outcomes should be checked against the corresponding image before final submission. The updated source code was executed with Node.js 22 in the preparation environment: **25 unit tests PASS, 0 FAIL**. Docker is not available in that preparation environment; Docker, API and cross-user ownership outcomes below are **not automatically revalidated** by the 25 unit tests. Run and photograph TC10 and TC11 on Windows before marking them PASS.

| ID | Preconditions | Steps | Test data | Expected result | Priority | Actual result / evidence | PASS/FAIL |
|---|---|---|---|---|---|---|---|
| TC01 | Source and Node runtime available | Execute `npm test` | 25 unit tests | All pass, no database needed | High | 25/25 PASS in preparation environment; recapture `TC01-unit-test.png` in Docker after applying patch | PASS (unit only) |
| TC02 | API and DB started | GET `/health` | No payload | HTTP 200, `ok`, `connected` | High | Previous screenshot `TC02-health.png`; rerun after patch | VERIFY |
| TC03 | Admin signed in | Open survey list and details | Seeded survey | Correct API-backed list and detail | High | `TC03-survey-list.png`, `TC03-survey-detail.png` exist | VERIFY |
| TC04 | CLOSED ticket with no survey | POST survey | CSAT=1, NPS=0 | HTTP 201, saved lower bounds | High | `TC04-csat-min-nps-min.png` exists | VERIFY |
| TC05 | **Different** CLOSED unsurveyed ticket | POST survey | CSAT=5, NPS=10 | HTTP 201, saved upper bounds | High | `TC05-csat-max-nps-max.png` exists; earlier run returned 409 when ticket was reused; verify screenshot is from successful retry | VERIFY |
| TC06 | Admin signed in | POST invalid survey | CSAT=0 or NPS=11 | HTTP 400, error body, no insert | High | `TC06-invalid-score.png` exists | VERIFY |
| TC07 | Ticket already surveyed | POST same ticket again | Existing ticket_id | HTTP 409, duplicate blocked | High | `TC07-duplicate-survey.png` exists | VERIFY |
| TC08 | OPEN ticket | POST survey | OPEN ticket_id, valid scores | HTTP 400, CLOSED-only rule | High | `TC08-open-ticket.png` exists | VERIFY |
| TC09 | No Bearer token | GET protected API | Missing Authorization | HTTP 401, generic error | High | `TC09-unauthorized.png` exists | VERIFY |
| TC10 | Separate clean Compose project | Build, check healthy, rerun without duplicate seed | Fresh named volume | All services healthy; same seeded counts on second start | Critical | `TC10-docker-clean.png`, `TC10-reproducibility.png` exist from prior run; rerun with updated compose | VERIFY |
| TC11 | Two different users; survey belongs to user A | Login as A, GET own survey; login as B, GET A's survey | Two tokens, same response_id | A gets 200, B gets 404 | Critical | Four mocked owner-scope unit tests PASS; **real API evidence missing**: capture `TC11-owner-access.png` | NOT RUN (API) |

**Summary.** Unit regression: 25 PASS, 0 FAIL (verified in preparation environment). Report scenarios: **1 unit PASS, 9 pending evidence recheck, 1 API NOT RUN**. Do **not** report 11/11 PASS until TC02-TC11 have been rerun and verified in the user's Docker environment. The required five categories are represented in the plan but the owner-scope and clean-environment evidence remain outstanding.

**Bug history.** BUG-01: surveyed ticket reopened (200 before / 409 after), commit `3ad71ec`; BUG-02: invalid calendar date accepted (test failed before / passed after), commit `1acdf8f`; BUG-03: invalid timezone offset accepted (test failed before / passed after), commit `a9a0958`. Before/after screenshots are under `docs/screenshots/BUG-xx-*.png`.

**Evidence policy.** PASS only after the real result matches the expected HTTP status/body or UI state, and the screenshot/log has been saved. Record run date and environment in the screenshot or log. Keep the original failed runs as bug evidence.
