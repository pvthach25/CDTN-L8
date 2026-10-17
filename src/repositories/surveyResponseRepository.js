
const pool = require("../config/database");

async function findAll() {
  const result = await pool.query(
    `SELECT response_id, ticket_id, csat_score,
            nps_score, comment, responded_at
     FROM survey_response
     ORDER BY response_id ASC`
  );
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM survey_response WHERE response_id = $1",
    [id]
  );
  return result.rows[0] || null;
}

async function findTicket(ticketId) {
  const result = await pool.query(
    "SELECT ticket_id, status FROM ticket WHERE ticket_id = $1",
    [ticketId]
  );
  return result.rows[0] || null;
}

async function create(data) {
  const result = await pool.query(
    `INSERT INTO survey_response
       (ticket_id, csat_score, nps_score, comment)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.ticket_id, data.csat_score, data.nps_score,
     data.comment ?? null]
  );
  return result.rows[0];
}

async function update(id, data) {
  const result = await pool.query(
    `UPDATE survey_response
     SET csat_score = $1,
         nps_score = $2,
         comment = $3
     WHERE response_id = $4
     RETURNING *`,
    [data.csat_score, data.nps_score,
     data.comment ?? null, id]
  );
  return result.rows[0] || null;
}

async function remove(id) {
  const result = await pool.query(
    "DELETE FROM survey_response WHERE response_id = $1 RETURNING *",
    [id]
  );
  return result.rows[0] || null;
}

module.exports = {
  findAll, findById, findTicket, create, update, remove
};
