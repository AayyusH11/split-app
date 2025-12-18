const express = require("express");
const { getBalances, settlePartialBalance } = require("../controllers/balance.controller");

const router = express.Router();

router.get("/:groupId", getBalances);
router.post("/settle", settlePartialBalance);

module.exports = router;