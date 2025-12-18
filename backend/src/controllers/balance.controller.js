const mongoose = require("mongoose");
const Balance = require("../models/Balance");
const simplifyBalances = require("../services/simplify.service");



const getBalances = async (req, res) => {
  const { groupId } = req.params;

  const balances = await Balance.find({
    groupId: new mongoose.Types.ObjectId(groupId),
  });

  const simplified = simplifyBalances(balances);
  res.json(simplified);
};


const settlePartialBalance = async (req, res) => {
  const { from, to, amount } = req.body;

  const balance = await Balance.findOne({ from, to });

  if (!balance) {
    return res.status(404).json({ error: "No such balance exists" });
  }

  if (amount >= balance.amount) {
    await Balance.deleteOne({ _id: balance._id });
  } else {
    balance.amount -= amount;
    await balance.save();
  }

  res.json({ message: "Balance settled successfully" });
};

module.exports = {getBalances,settlePartialBalance};