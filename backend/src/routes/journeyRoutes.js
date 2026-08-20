const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getMyEvents, createEvent, deleteEvent } = require("../controllers/journeyController");

const router = express.Router();
router.use(protect);
router.get("/me", getMyEvents);
router.post("/me", createEvent);
router.delete("/me/:id", deleteEvent);

module.exports = router;
