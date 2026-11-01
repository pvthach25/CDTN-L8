
const pool = require("../config/database");

async function findUser(username) {
  const result = await pool.query(
    "SELECT user_id, username, password_hash FROM app_user WHERE username = $1",
    [username]
  );
  return result.rows[0] || null;
}

async function createSession(userId, tokenHash, expiresAt) {
  await pool.query(
    `INSERT INTO auth_session (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );
}

async function findSession(tokenHash) {
  const result = await pool.query(
    `SELECT u.user_id, u.username
     FROM auth_session s
     JOIN app_user u ON u.user_id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > NOW()`,
    [tokenHash]
  );
  return result.rows[0] || null;
}

async function deleteSession(tokenHash) {
  await pool.query(
    "DELETE FROM auth_session WHERE token_hash = $1",
    [tokenHash]
  );
}

module.exports = {
  findUser,
  createSession,
  findSession,
  deleteSession
};
