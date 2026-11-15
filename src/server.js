require('dotenv').config();
const app = require('./app');
const bootstrap = require('./bootstrap');
const pool = require('./config/database');
const PORT = Number(process.env.PORT) || 3000;

async function main() {
  await bootstrap();
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart CRM API listening on port ${PORT}`);
  });
  const shutdown = () => server.close(() => {
    pool.end().then(() => process.exit(0)).catch(() => process.exit(1));
  });
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
main().catch((error) => {
  console.error('Startup failed:', error.message);
  process.exitCode = 1;
  pool.end().catch(() => {});
});
