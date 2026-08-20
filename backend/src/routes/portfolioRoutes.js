const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getPublicPortfolio, getMyPortfolioPreview } = require("../controllers/portfolioController");

const router = express.Router();
router.get("/preview", protect, getMyPortfolioPreview);
router.get("/:userId", getPublicPortfolio);

module.exports = router;
