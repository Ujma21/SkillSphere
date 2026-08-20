const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getMyApplications, createApplication, updateApplication, deleteApplication } = require("../controllers/applicationController");

const router = express.Router();
router.use(protect);
router.get("/me", getMyApplications);
router.post("/me", createApplication);
router.put("/me/:id", updateApplication);
router.delete("/me/:id", deleteApplication);

module.exports = router;
