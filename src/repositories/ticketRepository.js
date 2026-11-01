
const pool = require("../config/database");

async function findAll() {
  const result = await pool.query(
    "SELECT * FROM ticket ORDER BY ticket_id"
  );
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM ticket WHERE ticket_id = $1",
    [id]
  );
  return result.rows[0] || null;
}

async function findAvailable() {
  const result = await pool.query(`
    SELECT t.ticket_id, t.status, t.closed_at,
           c.full_name, sc.center_name
    FROM ticket t
    JOIN customer c ON c.customer_id = t.customer_id
    JOIN service_center sc ON sc.center_id = t.center_id
    LEFT JOIN survey_response sr ON sr.ticket_id = t.ticket_id
    WHERE t.status = 'CLOSED'
      AND sr.response_id IS NULL
    ORDER BY t.ticket_id
  `);
  return result.rows;
}

async function create(data) {
  const result = await pool.query(
    `INSERT INTO ticket
       (customer_id, technician_id, center_id, status, closed_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      data.customer_id,
      data.technician_id,
      data.center_id,
      data.status,
      data.closed_at
    ]
  );
  return result.rows[0];
}

async function update(id, data) {
  const result = await pool.query(
    `UPDATE ticket
     SET customer_id = $1,
         technician_id = $2,
         center_id = $3,
         status = $4,
         closed_at = $5
     WHERE ticket_id = $6
     RETURNING *`,
    [
      data.customer_id,
      data.technician_id,
      data.center_id,
      data.status,
      data.closed_at,
      id
    ]
  );
  return result.rows[0] || null;
}

async function hasSurvey(id) {
  const result = await pool.query(
    "SELECT 1 FROM survey_response WHERE ticket_id = $1 LIMIT 1",
    [id]
  );
  return result.rowCount > 0;
}

async function remove(id) {
  const result = await pool.query(
    "DELETE FROM ticket WHERE ticket_id = $1 RETURNING *",
    [id]
  );
  return result.rows[0] || null;
}

module.exports = {
  findAll,
  findById,
  findAvailable,
  create,
  update,
  hasSurvey,
  remove
};
