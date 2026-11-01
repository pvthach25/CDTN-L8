
require("dotenv").config();

const crypto = require("node:crypto");
const pool = require("../src/config/database");

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password || password.length < 12) {
    throw new Error(
      "Can ADMIN_USERNAME va ADMIN_PASSWORD (toi thieu 12 ky tu)"
    );
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  await pool.query(
    `INSERT INTO app_user (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username)
     DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [username, `${salt}:${hash}`]
  );

  console.log(`Da tao/cap nhat tai khoan: ${username}`);
}

main()
  .catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
