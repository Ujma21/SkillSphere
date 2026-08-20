const express = require("express");
const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const { getMyJobs, createJob, updateJob, getCandidates, getJobApplicants, updateApplicantStatus } = require("../controllers/recruiterController");

const router = express.Router();
router.use(protect, allowRoles("recruiter"));
router.get("/jobs", getMyJobs);
router.post("/jobs", createJob);
router.put("/jobs/:id", updateJob);
router.get("/jobs/:id/applicants", getJobApplicants);
router.put("/applications/:applicationId", updateApplicantStatus);
router.get("/candidates", getCandidates);

module.exports = router;
