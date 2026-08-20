const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  company: { type: String, required: true, trim: true, maxlength: 100 },
  role: { type: String, required: true, trim: true, maxlength: 100 },
  status: { type: String, enum: ["applied", "assessment", "interview", "offer", "rejected", "withdrawn"], default: "applied" },
  appliedDate: { type: Date, required: true, default: Date.now },
  nextStep: { type: String, trim: true, maxlength: 160 },
  notes: { type: String, trim: true, maxlength: 500 },
  jobUrl: { type: String, trim: true },
}, { timestamps: true });

applicationSchema.index({ user: 1, job: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Application", applicationSchema);
