const express = require("express");
const { addExpense } = require("../controllers/expense.controller");

const router = express.Router();

router.post("/", addExpense);

module.exports = router;
