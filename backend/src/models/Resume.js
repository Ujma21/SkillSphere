const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    institution: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    graduationYear: {
      type: Number,
      min: 2000,
      max: 2100,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    company: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    startDate: {
      type: String,
      trim: true,
    },
    endDate: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { _id: false }
);

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    targetCareer: {
      type: String,
      trim: true,
    },

    summary: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    education: [educationSchema],

    experience: [experienceSchema],

    achievements: [achievementSchema],

    additionalSections: [
      {
        title: {
          type: String,
          trim: true,
          maxlength: 100,
        },
        content: {
          type: String,
          trim: true,
          maxlength: 1000,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);