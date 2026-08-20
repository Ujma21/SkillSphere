const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getMyReadiness } = require("../controllers/readinessController");

const router = express.Router();
router.get("/me", protect, getMyReadiness);

module.exports = router;
