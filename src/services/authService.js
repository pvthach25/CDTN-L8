
const crypto = require("node:crypto");
const repository = require("../repositories/authRepository");

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function verifyPassword(password, storedHash) {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;

  const [salt, expectedHex] = parts;
  if (!/^[a-f0-9]{32}$/.test(salt) ||
      !/^[a-f0-9]{128}$/.test(expectedHex)) return false;

  const actual = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");

  return crypto.timingSafeEqual(actual, expected);
}

async function login(username, password) {
  if (typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() || !password ||
      username.length > 100 || password.length > 1024) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const user = await repository.findUser(username.trim());

  if (!user || !verifyPassword(password, user.password_hash)) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);

  await repository.createSession(
    user.user_id,
    hashToken(token),
    expiresAt
  );

  return {
    token,
    expiresAt,
    user: { user_id: user.user_id, username: user.username }
  };
}

async function authenticate(token) {
  if (typeof token !== "string" ||
      !/^[a-f0-9]{64}$/.test(token)) {
    return null;
  }

  return repository.findSession(hashToken(token));
}

async function logout(token) {
  if (typeof token === "string" &&
      /^[a-f0-9]{64}$/.test(token)) {
    await repository.deleteSession(hashToken(token));
  }
}

module.exports = { login, authenticate, logout };
