const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  updateProfile,
  deleteProfile,
  changePassword,
  resetPassword
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteProfile);

router.put("/change-password", protect, changePassword);
router.put("/reset-password", resetPassword);

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;