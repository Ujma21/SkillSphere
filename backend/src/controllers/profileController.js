const StudentProfile = require("../models/StudentProfile");

const getMyProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    return res.status(200).json({ profile });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Could not load profile" });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const allowedFields = ["college", "degree", "graduationYear", "targetCareer", "githubUrl", "linkedinUrl", "dsaProblemsSolved", "skills", "projects", "certifications"];
    const updates = Object.fromEntries(allowedFields.filter((field) => Object.hasOwn(req.body, field)).map((field) => [field, req.body[field]]));
    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates, $setOnInsert: { user: req.user._id } },
      { new: true, upsert: true, runValidators: true }
    );
    return res.status(200).json({ message: "Career Passport saved", profile });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(400).json({ message: error.message || "Could not save profile" });
  }
};

module.exports = { getMyProfile, updateMyProfile };
