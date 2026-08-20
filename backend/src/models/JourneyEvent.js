const mongoose = require("mongoose");

const journeyEventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, enum: ["skill", "project", "certification", "internship", "interview", "achievement"], default: "skill" },
  eventDate: { type: Date, required: true },
  description: { type: String, trim: true, maxlength: 400 },
}, { timestamps: true });

module.exports = mongoose.model("JourneyEvent", journeyEventSchema);
