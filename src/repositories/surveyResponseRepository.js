const pool = require('../config/database');

async function findAll(ownerUserId) {
  const result = await pool.query(
    `SELECT response_id, ticket_id, csat_score, nps_score, comment, responded_at
     FROM survey_response WHERE owner_user_id = $1 ORDER BY response_id ASC`, [ownerUserId]
  );
  return result.rows;
}
async function findById(id, ownerUserId) {
  const result = await pool.query(
    'SELECT * FROM survey_response WHERE response_id = $1 AND owner_user_id = $2',
    [id, ownerUserId]
  );
  return result.rows[0] || null;
}
async function findTicket(ticketId) {
  const result = await pool.query('SELECT ticket_id, status FROM ticket WHERE ticket_id = $1', [ticketId]);
  return result.rows[0] || null;
}
async function create(data, ownerUserId) {
  const result = await pool.query(
    `INSERT INTO survey_response (ticket_id, csat_score, nps_score, comment, owner_user_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [data.ticket_id, data.csat_score, data.nps_score, data.comment ?? null, ownerUserId]
  );
  return result.rows[0];
}
async function update(id, data, ownerUserId) {
  const result = await pool.query(
    `UPDATE survey_response SET csat_score=$1, nps_score=$2, comment=$3
     WHERE response_id=$4 AND owner_user_id=$5 RETURNING *`,
    [data.csat_score, data.nps_score, data.comment ?? null, id, ownerUserId]
  );
  return result.rows[0] || null;
}
async function remove(id, ownerUserId) {
  const result = await pool.query(
    'DELETE FROM survey_response WHERE response_id=$1 AND owner_user_id=$2 RETURNING *',
    [id, ownerUserId]
  );
  return result.rows[0] || null;
}
module.exports = { findAll, findById, findTicket, create, update, remove };
