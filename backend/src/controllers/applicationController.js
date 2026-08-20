const Application = require("../models/Application");

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).sort({ appliedDate: -1, createdAt: -1 });
    return res.status(200).json({ applications });
  } catch (error) { return res.status(500).json({ message: "Could not load applications" }); }
};

const createApplication = async (req, res) => {
  try {
    const application = await Application.create({ ...req.body, user: req.user._id });
    return res.status(201).json({ message: "Application added", application });
  } catch (error) { return res.status(400).json({ message: error.message || "Could not add application" }); }
};

const updateApplication = async (req, res) => {
  try {
    const allowedFields = ["company", "role", "status", "appliedDate", "nextStep", "notes", "jobUrl"];
    const updates = Object.fromEntries(allowedFields.filter((field) => Object.hasOwn(req.body, field)).map((field) => [field, req.body[field]]));
    const application = await Application.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { $set: updates }, { new: true, runValidators: true });
    if (!application) return res.status(404).json({ message: "Application not found" });
    return res.status(200).json({ message: "Application updated", application });
  } catch (error) { return res.status(400).json({ message: error.message || "Could not update application" }); }
};

const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!application) return res.status(404).json({ message: "Application not found" });
    return res.status(200).json({ message: "Application removed" });
  } catch (error) { return res.status(400).json({ message: "Could not remove application" }); }
};

module.exports = { getMyApplications, createApplication, updateApplication, deleteApplication };
