
const repository = require("../repositories/surveyResponseRepository");

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateScores(data) {
  if (!Number.isInteger(data.csat_score) ||
      data.csat_score < 1 || data.csat_score > 5) {
    throw httpError(400, "CSAT phai la so nguyen tu 1 den 5");
  }

  if (!Number.isInteger(data.nps_score) ||
      data.nps_score < 0 || data.nps_score > 10) {
    throw httpError(400, "NPS phai la so nguyen tu 0 den 10");
  }

  if (data.comment != null && typeof data.comment !== "string") {
    throw httpError(400, "Comment phai la chuoi ky tu");
  }
}

async function getAll(ownerUserId) {
  return repository.findAll(ownerUserId);
}

async function getById(id, ownerUserId) {
  const response = await repository.findById(id, ownerUserId);
  if (!response) throw httpError(404, "Khong tim thay phan hoi");
  return response;
}

async function create(data, ownerUserId) {
  validateScores(data);

  if (!Number.isInteger(data.ticket_id) || data.ticket_id <= 0) {
    throw httpError(400, "ticket_id khong hop le");
  }

  const ticket = await repository.findTicket(data.ticket_id);

  if (!ticket) {
    throw httpError(404, "Khong tim thay ticket");
  }

  if (ticket.status !== "CLOSED") {
    throw httpError(400, "Chi duoc khao sat ticket da CLOSED");
  }

  return repository.create(data, ownerUserId);
}

async function update(id, data, ownerUserId) {
  await getById(id, ownerUserId);
  validateScores(data);
  return repository.update(id, data, ownerUserId);
}

async function remove(id, ownerUserId) {
  await getById(id, ownerUserId);
  return repository.remove(id, ownerUserId);
}

module.exports = { getAll, getById, create, update, remove };
