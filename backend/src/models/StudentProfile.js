const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, maxlength: 500 },
  techStack: [{ type: String, trim: true }],
  url: { type: String, trim: true },
}, { _id: false });

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  issuer: { type: String, trim: true },
  year: { type: Number, min: 2000, max: 2100 },
}, { _id: false });

const studentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  college: { type: String, trim: true, maxlength: 150 },
  degree: { type: String, trim: true, maxlength: 100 },
  graduationYear: { type: Number, min: 2000, max: 2100 },
  targetCareer: { type: String, enum: ["java-backend", "frontend", "full-stack", "data-analyst", "devops", "cloud-engineer"] },
  githubUrl: { type: String, trim: true },
  linkedinUrl: { type: String, trim: true },
  dsaProblemsSolved: { type: Number, min: 0, default: 0 },
  skills: [skillSchema],
  projects: [projectSchema],
  certifications: [certificationSchema],
}, { timestamps: true });

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
