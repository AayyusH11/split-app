const mongoose = require("mongoose");
const Balance = require("../models/Balance");

const updateBalances = async (groupId, paidBy, splits) => {
  for (let split of splits) {
    if (split.userId.toString() === paidBy.toString()) continue;

    const existing = await Balance.findOne({
      from: split.userId,
      to: paidBy,
      groupId,
    });

    if (existing) {
      existing.amount += split.amount;
      await existing.save();
    } else {
      await Balance.create({
        from: split.userId,
        to: paidBy,
        amount: split.amount,
        groupId, //
      });
    }
  }
};

const settleGroupBalances = async (groupId) => {
  await Balance.deleteMany({
    groupId: new mongoose.Types.ObjectId(groupId),
  });
};

module.exports = { updateBalances, settleGroupBalances };
