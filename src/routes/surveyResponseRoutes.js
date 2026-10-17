
const express = require("express");
const service = require("../services/surveyResponseService");

const router = express.Router();

function validateId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ error: "ID khong hop le" });
  }

  req.responseId = id;
  next();
}

function handleError(error, res) {
  if (error.code === "23505") {
    return res.status(409).json({
      error: "Ticket nay da co phan hoi khao sat"
    });
  }

  if (error.code === "23503") {
    return res.status(400).json({
      error: "Du lieu tham chieu khong hop le"
    });
  }

  console.error(error);
  return res.status(error.status || 500).json({
    error: error.status ? error.message : "Loi may chu"
  });
}

router.get("/", async (req, res) => {
  try {
    res.json(await service.getAll());
  } catch (error) {
    handleError(error, res);
  }
});

router.get("/:id", validateId, async (req, res) => {
  try {
    res.json(await service.getById(req.responseId));
  } catch (error) {
    handleError(error, res);
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await service.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

router.put("/:id", validateId, async (req, res) => {
  try {
    res.json(await service.update(req.responseId, req.body));
  } catch (error) {
    handleError(error, res);
  }
});

router.delete("/:id", validateId, async (req, res) => {
  try {
    res.json(await service.remove(req.responseId));
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
