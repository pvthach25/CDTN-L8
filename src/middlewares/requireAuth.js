
const authService = require("../services/authService");

async function requireAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const match = /^Bearer ([a-f0-9]{64})$/.exec(authorization);

    if (!match) {
      return res.status(401).json({
        error: "Vui long dang nhap"
      });
    }

    const user = await authService.authenticate(match[1]);

    if (!user) {
      return res.status(401).json({
        error: "Phien dang nhap khong hop le hoac da het han"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = requireAuth;
