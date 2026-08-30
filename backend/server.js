const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const readinessRoutes = require("./src/routes/readinessRoutes");
const journeyRoutes = require("./src/routes/journeyRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");
const portfolioRoutes = require("./src/routes/portfolioRoutes");
const recruiterRoutes = require("./src/routes/recruiterRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const jobPortalRoutes = require("./src/routes/jobPortalRoutes");
const resumeRoutes = require("./src/routes/resumeRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/readiness", readinessRoutes);
app.use("/api/journey", journeyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/jobs", jobPortalRoutes);
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "SkillSphere API is running"
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`SkillSphere server running on port ${PORT}`);
  });
};

startServer();
