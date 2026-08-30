const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getMyResume,
  updateMyResume,
} = require("../controllers/resumeController");

const router = express.Router();

router.use(protect);

router.get("/me", getMyResume);

router.put("/me", updateMyResume);

module.exports = router;