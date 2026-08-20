const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  company: { type: String, required: true, trim: true, maxlength: 100 },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  location: { type: String, trim: true, maxlength: 100 },
  type: { type: String, enum: ["internship", "full-time", "part-time"], default: "full-time" },
  skills: [{ type: String, trim: true }],
  description: { type: String, trim: true, maxlength: 1200 },
  status: { type: String, enum: ["open", "closed"], default: "open" },
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
