
const express = require("express");
const authService = require("../services/authService");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const result = await authService.login(username, password);
    res.json(result);
  } catch (error) {
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        error: "Sai tai khoan hoac mat khau"
      });
    }
    console.error(error);
    res.status(500).json({ error: "Loi may chu" });
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json(req.user);
});

router.post("/logout", requireAuth, async (req, res) => {
  try {
    const token = req.headers.authorization.slice(7);
    await authService.logout(token);
    res.json({ message: "Dang xuat thanh cong" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi may chu" });
  }
});

module.exports = router;
