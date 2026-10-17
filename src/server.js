require("dotenv").config();

const app = require("./app");

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Smart CRM API listening on port ${PORT}`);
});

function shutdown() {
  server.close(() => {
    const pool = require("./config/database");

    pool.end()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);