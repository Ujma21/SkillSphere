const mongoose = require("mongoose");
const StudentProfile = require("../models/StudentProfile");
const { calculateReadiness } = require("../services/readinessService");

const buildPortfolio = async (userId) => {
  const profile = await StudentProfile.findOne({ user: userId }).populate("user", "name");
  if (!profile) return null;
  return { student: profile.user, profile, readiness: calculateReadiness(profile) };
};

const getMyPortfolioPreview = async (req, res) => {
  try {
    const portfolio = await buildPortfolio(req.user._id);
    if (!portfolio) return res.status(404).json({ message: "Complete and save your Career Passport before previewing it." });
    return res.status(200).json({ portfolio });
  } catch (error) {
    console.error("Portfolio preview error:", error);
    return res.status(500).json({ message: "Could not load portfolio preview" });
  }
};

const getPublicPortfolio = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) return res.status(400).json({ message: "Invalid portfolio link" });
    const portfolio = await buildPortfolio(req.params.userId);
    if (!portfolio) return res.status(404).json({ message: "This Career Passport has not been created yet." });
    return res.status(200).json({ portfolio });
  } catch (error) {
    console.error("Public portfolio error:", error);
    return res.status(500).json({ message: "Could not load portfolio" });
  }
};

module.exports = { getPublicPortfolio, getMyPortfolioPreview };
