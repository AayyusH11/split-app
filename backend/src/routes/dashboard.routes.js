const express = require("express");
const { getDashboard } = require("../controllers/dashboard.controller");

const router = express.Router();

// Dashboard for a user
router.get("/:userId", getDashboard);

module.exports = router;