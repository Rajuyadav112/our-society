const express = require("express");
const router = express.Router();

const {
  registerUser,
  securityRegister,
  loginUser,
  adminLogin,
  forgotPassword,
  resetPassword,
  uploadProfilePicture,
  updateUserProfile,
  getAllUsers,
  updateUserStatus,
  getAdminUser
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/register", upload.single('profilePicture'), registerUser);
router.post("/security-register", securityRegister);
router.post("/login", loginUser);
router.post("/admin-login", adminLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/admin", auth, getAdminUser);

const User = require("../models/user");

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Token verified", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/profile-picture", auth, upload.single('profilePicture'), uploadProfilePicture);
router.put("/profile", auth, updateUserProfile);
router.get("/all", auth, getAllUsers);
router.put("/:id/status", auth, updateUserStatus);
router.delete("/:id", auth, require("../controllers/userController").deleteUser);

module.exports = router;
