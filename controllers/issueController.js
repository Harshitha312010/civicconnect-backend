const Issue = require("../models/Issue");


// 🔹 Create Issue
const createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      latitude,
      longitude,
      image,
    } = req.body;

    const issue = await Issue.create({
      title,
      description,
      category,
      location,
      latitude,
      longitude,
      image,
      user: req.user._id,
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Get All Issues (filter + search)
const getIssues = async (req, res) => {
  try {
    const { status, category, search } = req.query;

    let filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const issues = await Issue.find(filter).populate("user", "name email");

    res.json(issues);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get Single Issue
const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Update Issue Status
const updateIssueStatus = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = req.body.status;

    if (req.body.status === "Resolved") {
      issue.resolvedAt = new Date();
    }

    const updatedIssue = await issue.save();

    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Delete Issue
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    await issue.deleteOne();

    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Get Issue Statistics (Improved)
const getIssueStats = async (req, res) => {
  try {
    const total = await Issue.countDocuments();

    const pending = await Issue.countDocuments({ status: "Pending" });
    const inProgress = await Issue.countDocuments({ status: "In Progress" });
    const resolved = await Issue.countDocuments({ status: "Resolved" });

    // Category counts
    const water = await Issue.countDocuments({ category: "Water" });
    const road = await Issue.countDocuments({ category: "Road" });
    const electricity = await Issue.countDocuments({ category: "Electricity" });
    const garbage = await Issue.countDocuments({ category: "Garbage" });
    const other = await Issue.countDocuments({ category: "Other" });

    res.json({
      total,
      pending,
      inProgress,
      resolved,
      byCategory: {
        Water: water,
        Road: road,
        Electricity: electricity,
        Garbage: garbage,
        Other: other,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ EXPORT EVERYTHING
module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssueStatus,
  deleteIssue,
  getIssueStats,
};