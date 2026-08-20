const express = require("express");
const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const { getAnalytics } = require("../controllers/adminController");

const router = express.Router();
router.get("/analytics", protect, allowRoles("admin"), getAnalytics);

module.exports = router;
