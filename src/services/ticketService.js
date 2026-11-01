
const repo = require("../repositories/ticketRepository");

function businessError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function parseId(value) {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw businessError("INVALID_ID", "ID phai la so nguyen duong");
  }

  return id;
}

function validateTicket(data) {
  const customerId = parseId(data.customer_id);
  const technicianId = parseId(data.technician_id);
  const centerId = parseId(data.center_id);

  const allowed = ["OPEN", "IN_PROGRESS", "CLOSED"];

  if (!allowed.includes(data.status)) {
    throw businessError("INVALID_STATUS", "Trang thai ticket khong hop le");
  }

  const closedAt = data.closed_at || null;

  if (data.status === "CLOSED" && !closedAt) {
    throw businessError(
      "INVALID_CLOSED_AT",
      "Ticket CLOSED phai co thoi gian dong"
    );
  }

  if (data.status !== "CLOSED" && closedAt) {
    throw businessError(
      "INVALID_CLOSED_AT",
      "Ticket chua dong khong duoc co thoi gian dong"
    );
  }

  if (closedAt && Number.isNaN(Date.parse(closedAt))) {
    throw businessError("INVALID_DATE", "Ngay dong khong hop le");
  }

  return {
    customer_id: customerId,
    technician_id: technicianId,
    center_id: centerId,
    status: data.status,
    closed_at: closedAt
  };
}

async function getAll() {
  return repo.findAll();
}

async function getById(id) {
  const ticket = await repo.findById(parseId(id));

  if (!ticket) {
    throw businessError("NOT_FOUND", "Khong tim thay ticket");
  }

  return ticket;
}

async function getAvailable() {
  return repo.findAvailable();
}

async function create(data) {
  return repo.create(validateTicket(data));
}

async function update(id, data) {
  const ticketId = parseId(id);
  const existing = await repo.findById(ticketId);

  if (!existing) {
    throw businessError("NOT_FOUND", "Khong tim thay ticket");
  }

  const mergedData = {
    customer_id: data.customer_id ?? existing.customer_id,
    technician_id: data.technician_id ?? existing.technician_id,
    center_id: data.center_id ?? existing.center_id,
    status: data.status ?? existing.status,
    closed_at: data.closed_at ?? existing.closed_at
  };

  if (mergedData.status !== "CLOSED") {
    mergedData.closed_at = null;
  }

  return repo.update(ticketId, validateTicket(mergedData));
}

async function remove(id) {
  const ticketId = parseId(id);
  const existing = await repo.findById(ticketId);

  if (!existing) {
    throw businessError("NOT_FOUND", "Khong tim thay ticket");
  }

  if (await repo.hasSurvey(ticketId)) {
    throw businessError(
      "TICKET_HAS_SURVEY",
      "Khong the xoa ticket da co khao sat"
    );
  }

  return repo.remove(ticketId);
}

module.exports = {
  getAll,
  getById,
  getAvailable,
  create,
  update,
  remove
};
