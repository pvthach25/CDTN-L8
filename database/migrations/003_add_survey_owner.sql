-- Ownership for survey API (OWASP A01). Existing records are assigned at bootstrap.
ALTER TABLE survey_response ADD COLUMN IF NOT EXISTS owner_user_id INTEGER REFERENCES app_user(user_id);
