const express = require("express");
const router = express.Router();

const { adminOnly } = require("../middleware/adminMiddleware");
const { protect } = require("../middleware/authMiddleware");

const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssueStatus,
  deleteIssue,
  getIssueStats,
} = require("../controllers/issueController");

// 🔹 Create Issue (Protected)
router.post("/", protect, createIssue);

// 🔹 Get All Issues (with filtering)
router.get("/", getIssues);

// 🔹 Get Issue Statistics (IMPORTANT: must come before :id)
router.get("/stats", getIssueStats);

// 🔹 Get Single Issue
router.get("/:id", getIssueById);

// 🔹 Update Issue Status (Admin Only)
router.put("/:id", protect, adminOnly, updateIssueStatus);

// 🔹 Delete Issue (Admin Only)
router.delete("/:id", protect, adminOnly, deleteIssue);

module.exports = router;