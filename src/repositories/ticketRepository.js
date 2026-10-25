const pool = require('../config/database');
async function findAvailable() {
 const result = await pool.query(`SELECT t.ticket_id, t.status, t.closed_at, c.full_name, sc.center_name
 FROM ticket t JOIN customer c ON c.customer_id=t.customer_id
 JOIN service_center sc ON sc.center_id=t.center_id
 LEFT JOIN survey_response sr ON sr.ticket_id=t.ticket_id
 WHERE t.status='CLOSED' AND sr.response_id IS NULL ORDER BY t.ticket_id`);
 return result.rows;
}
module.exports={findAvailable};
