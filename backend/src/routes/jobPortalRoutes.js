const express = require("express");
const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const { getOpenJobs, applyToJob, getMyJobApplications } = require("../controllers/jobPortalController");

const router = express.Router();
router.get("/", protect, allowRoles("student"), getOpenJobs);
router.get("/my-applications", protect, allowRoles("student"), getMyJobApplications);
router.post("/:jobId/apply", protect, allowRoles("student"), applyToJob);

module.exports = router;
