const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getMyProfile, updateMyProfile } = require("../controllers/profileController");

const router = express.Router();
router.use(protect);
router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);

module.exports = router;
