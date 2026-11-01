
const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");

// Mock PostgreSQL để unit test không cần kết nối DB.
const originalLoad = Module._load;


Module._load = function (request, parent, isMain) {
  if (request === "pg") {
    return {
      Pool: class {
        on() {
          return this;
        }

        query() {
          throw new Error("DB should be mocked in unit tests");
        }
      }
    };
  }

  return originalLoad.apply(this, arguments);
};


const repo = require("../src/repositories/ticketRepository");

Module._load = originalLoad;

const service = require("../src/services/ticketService");
const originals = { ...repo };

function mock(changes) {
  Object.assign(repo, originals, changes);
}

test.afterEach(() => {
  Object.assign(repo, originals);
});

const existingTicket = {
  ticket_id: 1,
  customer_id: 1,
  technician_id: 1,
  center_id: 1,
  status: "OPEN",
  closed_at: null
};

test("Create valid OPEN ticket", async () => {
  mock({
    create: async (data) => ({ ticket_id: 1, ...data })
  });

  const result = await service.create({
    customer_id: 1,
    technician_id: 1,
    center_id: 1,
    status: "OPEN"
  });

  assert.equal(result.status, "OPEN");
  assert.equal(result.closed_at, null);
});

test("Reject invalid customer ID", async () => {
  await assert.rejects(
    service.create({
      customer_id: 0,
      technician_id: 1,
      center_id: 1,
      status: "OPEN"
    }),
    { code: "INVALID_ID" }
  );
});

test("Reject invalid ticket status", async () => {
  await assert.rejects(
    service.create({
      customer_id: 1,
      technician_id: 1,
      center_id: 1,
      status: "INVALID"
    }),
    { code: "INVALID_STATUS" }
  );
});

test("Reject CLOSED ticket without closed_at", async () => {
  await assert.rejects(
    service.create({
      customer_id: 1,
      technician_id: 1,
      center_id: 1,
      status: "CLOSED"
    }),
    { code: "INVALID_CLOSED_AT" }
  );
});

test("Reject OPEN ticket with closed_at", async () => {
  await assert.rejects(
    service.create({
      customer_id: 1,
      technician_id: 1,
      center_id: 1,
      status: "OPEN",
      closed_at: "2026-11-01T08:00:00Z"
    }),
    { code: "INVALID_CLOSED_AT" }
  );
});

test("Get existing ticket", async () => {
  mock({
    findById: async () => existingTicket
  });

  const result = await service.getById(1);
  assert.equal(result.ticket_id, 1);
});

test("Reject unknown ticket", async () => {
  mock({
    findById: async () => null
  });

  await assert.rejects(
    service.getById(999),
    { code: "NOT_FOUND" }
  );
});

test("Update ticket status", async () => {
  mock({
    findById: async () => existingTicket,
    update: async (id, data) => ({ ticket_id: id, ...data })
  });

  const result = await service.update(1, {
    status: "IN_PROGRESS"
  });

  assert.equal(result.status, "IN_PROGRESS");
  assert.equal(result.customer_id, 1);
});

test("Delete ticket without survey", async () => {
  mock({
    findById: async () => existingTicket,
    hasSurvey: async () => false,
    remove: async () => existingTicket
  });

  const result = await service.remove(1);
  assert.equal(result.ticket_id, 1);
});

test("Reject deleting ticket with survey", async () => {
  mock({
    findById: async () => existingTicket,
    hasSurvey: async () => true
  });

  await assert.rejects(
    service.remove(1),
    { code: "TICKET_HAS_SURVEY" }
  );
});
