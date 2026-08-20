const JourneyEvent = require("../models/JourneyEvent");

const getMyEvents = async (req, res) => {
  try {
    const events = await JourneyEvent.find({ user: req.user._id }).sort({ eventDate: -1, createdAt: -1 });
    return res.status(200).json({ events });
  } catch (error) { return res.status(500).json({ message: "Could not load journey events" }); }
};

const createEvent = async (req, res) => {
  try {
    const event = await JourneyEvent.create({ ...req.body, user: req.user._id });
    return res.status(201).json({ message: "Timeline event added", event });
  } catch (error) { return res.status(400).json({ message: error.message || "Could not add timeline event" }); }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await JourneyEvent.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!event) return res.status(404).json({ message: "Timeline event not found" });
    return res.status(200).json({ message: "Timeline event removed" });
  } catch (error) { return res.status(400).json({ message: "Could not remove timeline event" }); }
};

module.exports = { getMyEvents, createEvent, deleteEvent };
