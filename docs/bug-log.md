# BT3 Bug Log - Smart CRM L8 (SE)

## BUG-01 - Surveyed ticket could be reopened (MAJOR)
- **Detected by:** BUG-01 API regression, PUT `/api/tickets/1` with `{"status":"OPEN"` after survey submission.
- **Symptom:** Before the fix, HTTP 200 and ticket changed to OPEN despite an existing survey; business data became inconsistent.
- **Reproduction:** On a separate test database, authenticate, select a CLOSED surveyed ticket, PUT status OPEN, then GET the ticket.
- **Root cause:** `ticketService.update()` did not check `repo.hasSurvey(ticketId)` before changing status.
- **Fix:** Block transitions away from CLOSED when the ticket has a survey; return `TICKET_HAS_SURVEY` mapped to HTTP 409.
- **Evidence:** `screenshots/BUG-01-before.png` and `screenshots/BUG-01-after.png`; API returned 409 and ticket remained CLOSED after the fix.
- **Fix commit / verification:** https://github.com/pvthach25/CDTN-L8/commit/3ad71ec ; regression test `BUG-01: Reject reopening surveyed ticket` PASS. **Closed**.

## BUG-02 - Impossible calendar date accepted (MAJOR)
- **Detected by:** `BUG-02: Reject invalid calendar date` in `tests/ticketService.test.js`.
- **Symptom:** `closed_at=2026-02-30T10:00:00Z` was accepted before the fix; test result 19 PASS / 1 FAIL.
- **Reproduction:** Create a CLOSED ticket with that date in the service unit test, then run `npm test`.
- **Root cause:** JavaScript `Date.parse()` accepts/normalizes some impossible calendar dates instead of rejecting them.
- **Fix:** Validate ISO timestamp format and verify day/month/year against the UTC calendar.
- **Evidence:** `screenshots/BUG-02-before.png` and `screenshots/BUG-02-after.png`; 20/20 unit tests passed at the time of repair.
- **Fix commit / verification:** https://github.com/pvthach25/CDTN-L8/commit/1acdf8f ; test PASS. **Closed**.

## BUG-03 - Invalid timezone offset accepted (MAJOR)
- **Detected by:** `BUG-03: Reject invalid time zone offset` in `tests/ticketService.test.js`.
- **Symptom:** `closed_at=2026-11-07T10:00:00+15:00` was accepted before the fix; test result 20 PASS / 1 FAIL.
- **Reproduction:** Create a CLOSED ticket with that timestamp in the service unit test, then run `npm test`.
- **Root cause:** ISO timestamp validation did not enforce a maximum timezone offset or time-component limits.
- **Fix:** Reject invalid hours/minutes/seconds and offsets beyond ±14:00.
- **Evidence:** `screenshots/BUG-03-before.png` and `screenshots/BUG-03-after.png`; 21/21 unit tests passed at the time of repair.
- **Fix commit / verification:** https://github.com/pvthach25/CDTN-L8/commit/a9a0958 ; test PASS. **Closed**.

**Post-fix regression:** 25/25 unit tests PASS after adding four survey-ownership unit tests. The three historical bug-fix commits remain separate; the new BT3 packaging/security changes must be committed separately.
