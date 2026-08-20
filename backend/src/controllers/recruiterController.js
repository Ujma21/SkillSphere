const Job = require("../models/Job");
const StudentProfile = require("../models/StudentProfile");
const { calculateReadiness } = require("../services/readinessService");
const Application = require("../models/Application");

const getMyJobs = async (req, res) => {
  try { return res.status(200).json({ jobs: await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 }) }); }
  catch { return res.status(500).json({ message: "Could not load jobs" }); }
};

const createJob = async (req, res) => {
  try {
    const skills = Array.isArray(req.body.skills) ? req.body.skills : [];
    const job = await Job.create({ ...req.body, skills, recruiter: req.user._id });
    return res.status(201).json({ message: "Job posted", job });
  } catch (error) { return res.status(400).json({ message: error.message || "Could not post job" }); }
};

const updateJob = async (req, res) => {
  try {
    const allowedFields = ["company", "title", "location", "type", "skills", "description", "status"];
    const updates = Object.fromEntries(allowedFields.filter((field) => Object.hasOwn(req.body, field)).map((field) => [field, req.body[field]]));
    const job = await Job.findOneAndUpdate({ _id: req.params.id, recruiter: req.user._id }, { $set: updates }, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    return res.status(200).json({ message: "Job updated", job });
  } catch (error) { return res.status(400).json({ message: error.message || "Could not update job" }); }
};

const getCandidates = async (req, res) => {
  try {
    const profiles = await StudentProfile.find({ targetCareer: { $in: ["java-backend", "frontend", "full-stack"] } }).populate("user", "name").limit(60);
    const candidates = profiles.map((profile) => {
      const readiness = calculateReadiness(profile);
      return { userId: profile.user._id, name: profile.user.name, targetCareer: readiness.career, readinessScore: readiness.score, skills: profile.skills.map((skill) => skill.name), projects: profile.projects.length };
    }).sort((a, b) => b.readinessScore - a.readinessScore);
    return res.status(200).json({ candidates });
  } catch { return res.status(500).json({ message: "Could not load candidates" }); }
};

const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, recruiter: req.user._id });
    if (!job) return res.status(404).json({ message: "Job not found" });
    const applications = await Application.find({ job: job._id }).populate("user", "name").sort({ createdAt: -1 });
    return res.status(200).json({ job, applicants: applications.map((application) => ({ id: application._id, userId: application.user._id, name: application.user.name, status: application.status, appliedDate: application.appliedDate })) });
  } catch { return res.status(500).json({ message: "Could not load applicants" }); }
};

const updateApplicantStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId).populate("job");
    if (!application || !application.job || String(application.job.recruiter) !== String(req.user._id)) return res.status(404).json({ message: "Application not found" });
    application.status = req.body.status;
    await application.save();
    return res.status(200).json({ message: "Applicant status updated", application });
  } catch (error) { return res.status(400).json({ message: error.message || "Could not update applicant" }); }
};

module.exports = { getMyJobs, createJob, updateJob, getCandidates, getJobApplicants, updateApplicantStatus };
