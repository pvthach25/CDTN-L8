
const router = require("express").Router();
const service = require("../services/ticketService");

function handleError(res, error) {
  const statuses = {
    INVALID_ID: 400,
    INVALID_STATUS: 400,
    INVALID_CLOSED_AT: 400,
    INVALID_DATE: 400,
    NOT_FOUND: 404,
    TICKET_HAS_SURVEY: 409
  };

  const status = statuses[error.code] || 500;

  if (status === 500) {
    console.error(error);
  }

  return res.status(status).json({
    error: status === 500
      ? "Loi he thong"
      : error.message
  });
}

router.get("/available", async (req, res) => {
  try {
    res.json(await service.getAvailable());
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/", async (req, res) => {
  try {
    res.json(await service.getAll());
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    res.json(await service.getById(req.params.id));
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/", async (req, res) => {
  try {
    const ticket = await service.create(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    res.json(await service.update(req.params.id, req.body));
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    res.json(await service.remove(req.params.id));
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
