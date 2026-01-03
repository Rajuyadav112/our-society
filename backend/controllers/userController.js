const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require('../models/user');

const ADMIN_PASSKEY = "ADMIN_SECRET_KEY_2024"; // Hardcoded for simplified demo

const registerUser = async (req, res) => {
  try {
    const { phone, name, flatOwnerName, flatNumber, wing } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    let user = await User.findOne({ where: { phone } });
    if (user) return res.json({ message: 'User already exists', user });

    user = await User.create({
      phone,
      name,
      flatOwnerName,
      flatNumber,
      wing,
      profilePicture
    });
    return res.json({ message: 'User created successfully', user });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const user = await User.findOne({ where: { phone } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        phone: user.phone,
        role: user.role
      },
      "SECRET_KEY",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { passkey, name, phone } = req.body;

    if (passkey !== ADMIN_PASSKEY) {
      return res.status(401).json({ error: "Invalid Admin Passkey" });
    }

    // Check if admin user exists, or create on the fly
    let user = await User.findOne({ where: { phone } });
    if (!user) {
      user = await User.create({
        phone,
        name: name || "Admin",
        role: "admin"
      });
    } else {
      // Ensure they are admin
      if (user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }
    }

    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role },
      "SECRET_KEY",
      { expiresIn: "7d" }
    );

    return res.json({ message: "Admin Login Successful", token, user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Admin login failed" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone number is required" });

    const user = await User.findOne({ where: { phone } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Log OTP to console for development (In production, use an SMS service)
    console.log(`[SECURITY] OTP for ${phone}: ${otp}`);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;
    if (!phone || !otp || !newPassword) {
      return res.status(400).json({ error: "Fill all fields" });
    }

    const user = await User.findOne({ where: { phone } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Reset failed" });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const userId = req.user.id;
    const profilePicture = `/uploads/${req.file.filename}`;

    await User.update({ profilePicture }, { where: { id: userId } });

    res.json({ message: "Profile picture updated", profilePicture });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, wing, flatNumber, flatOwnerName } = req.body;

    await User.update({ name, wing, flatNumber, flatOwnerName }, { where: { id: userId } });
    const updatedUser = await User.findByPk(userId);

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Access denied" });
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Access denied" });
    const { id } = req.params;
    const { status } = req.body;

    await User.update({ status }, { where: { id } });
    res.json({ message: "User status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAdminUser = async (req, res) => {
  try {
    const admin = await User.findOne({ where: { role: 'admin' } });
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  adminLogin,
  forgotPassword,
  resetPassword,
  uploadProfilePicture,
  updateUserProfile,
  getAllUsers,
  updateUserStatus,
  getAdminUser
};
