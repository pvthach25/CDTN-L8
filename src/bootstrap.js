// Local prototype bootstrap: create a demo administrator if missing and migrate
// survey ownership for existing database volumes. Never logs credentials.
const crypto = require('node:crypto');
const pool = require('./config/database');

async function bootstrap() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password || password.length < 12) {
    throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD (at least 12 characters) are required');
  }
  // Existing volumes do not rerun docker-entrypoint-initdb.d scripts.
  await pool.query(`ALTER TABLE survey_response
    ADD COLUMN IF NOT EXISTS owner_user_id INTEGER REFERENCES app_user(user_id)`);
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  await pool.query(`INSERT INTO app_user (username, password_hash)
    VALUES ($1, $2) ON CONFLICT (username) DO NOTHING`, [username, `${salt}:${hash}`]);
  const {rows} = await pool.query('SELECT user_id FROM app_user WHERE username = $1', [username]);
  // Assign legacy seed records to the initial administrator once only.
  await pool.query(`UPDATE survey_response SET owner_user_id = $1
    WHERE owner_user_id IS NULL`, [rows[0].user_id]);
}
module.exports = bootstrap;
