const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "You are authenticated",
    user: req.user,
  });
});

module.exports = router;