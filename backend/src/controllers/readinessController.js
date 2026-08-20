const StudentProfile = require("../models/StudentProfile");
const { calculateReadiness } = require("../services/readinessService");

const getMyReadiness = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(200).json({ readiness: calculateReadiness({}) });
    return res.status(200).json({ readiness: calculateReadiness(profile) });
  } catch (error) {
    console.error("Readiness error:", error);
    return res.status(500).json({ message: "Could not calculate readiness" });
  }
};

module.exports = { getMyReadiness };
