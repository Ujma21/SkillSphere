const Resume = require("../models/Resume");

const getMyResume = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can access the Resume Builder",
      });
    }

    const resume = await Resume.findOne({
      user: req.user._id,
    });

    return res.status(200).json({
      resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);

    return res.status(500).json({
      message: "Could not load resume",
    });
  }
};

const updateMyResume = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can use the Resume Builder",
      });
    }

    const allowedFields = [
      "targetCareer",
      "summary",
      "phone",
      "location",
      "education",
      "experience",
      "achievements",
      "additionalSections",
    ];

    const updates = Object.fromEntries(
      allowedFields
        .filter((field) => Object.hasOwn(req.body, field))
        .map((field) => [field, req.body[field]])
    );

    const resume = await Resume.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: updates,
        $setOnInsert: {
          user: req.user._id,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: "Resume saved",
      resume,
    });
  } catch (error) {
    console.error("Update resume error:", error);

    return res.status(400).json({
      message: error.message || "Could not save resume",
    });
  }
};

module.exports = {
  getMyResume,
  updateMyResume,
};