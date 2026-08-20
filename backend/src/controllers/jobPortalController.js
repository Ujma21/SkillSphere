const Job = require("../models/Job");
const Application = require("../models/Application");

const getOpenJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" }).populate("recruiter", "name").sort({ createdAt: -1 });
    return res.status(200).json({ jobs });
  } catch { return res.status(500).json({ message: "Could not load jobs" }); }
};

const applyToJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, status: "open" });
    if (!job) return res.status(404).json({ message: "This job is no longer available." });
    const existing = await Application.findOne({ user: req.user._id, job: job._id });
    if (existing) return res.status(409).json({ message: "You have already applied to this job." });
    const application = await Application.create({ user: req.user._id, job: job._id, company: job.company, role: job.title, status: "applied", appliedDate: new Date(), nextStep: "Application submitted" });
    return res.status(201).json({ message: "Application submitted", application });
  } catch (error) { return res.status(400).json({ message: error.message || "Could not submit application" }); }
};

const getMyJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id, job: { $exists: true } }).populate("job", "company title location type status").sort({ createdAt: -1 });
    return res.status(200).json({ applications });
  } catch { return res.status(500).json({ message: "Could not load job applications" }); }
};

module.exports = { getOpenJobs, applyToJob, getMyJobApplications };
