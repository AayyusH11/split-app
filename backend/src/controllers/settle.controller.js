const Balance = require("../models/Balance");

const settleDues = async (req, res) => {
  try {
    const { from, to, amount } = req.body;

    const balance = await Balance.findOne({ from, to });

    if (!balance) {
      return res.status(404).json({ error: "No pending dues found" });
    }

    if (amount > balance.amount) {
      return res.status(400).json({
        error: "Settlement amount exceeds due amount",
      });
    }

    balance.amount -= amount;

    if (balance.amount === 0) {
      await balance.deleteOne();
    } else {
      await balance.save();
    }

    res.json({ message: "Dues settled successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { settleDues };
