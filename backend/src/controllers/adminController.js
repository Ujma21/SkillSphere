const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Application = require("../models/Application");
const Job = require("../models/Job");
const { calculateReadiness } = require("../services/readinessService");

const getAnalytics = async (req, res) => {
  try {
    const [students, recruiters, profiles, applications, openJobs] = await Promise.all([
      User.countDocuments({ role: "student" }), User.countDocuments({ role: "recruiter" }), StudentProfile.find(), Application.find(), Job.countDocuments({ status: "open" }),
    ]);
    const scores = profiles.map((profile) => calculateReadiness(profile).score);
    const readiness = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
    const byTargetCareer = profiles.reduce((totals, profile) => { if (profile.targetCareer) totals[profile.targetCareer] = (totals[profile.targetCareer] || 0) + 1; return totals; }, {});
    const applicationStatus = applications.reduce((totals, application) => { totals[application.status] = (totals[application.status] || 0) + 1; return totals; }, {});
    return res.status(200).json({ analytics: { students, recruiters, profiles: profiles.length, averageReadiness: readiness, openJobs, applications: applications.length, byTargetCareer, applicationStatus } });
  } catch { return res.status(500).json({ message: "Could not load placement analytics" }); }
};

module.exports = { getAnalytics };
