const Balance = require("../models/Balance");

const applySplit = async ({
  groupId,
  paidBy,
  amount,
  splitType,
  participants,
  splits = {},
}) => {
  // case1: equal split 
  if (splitType === "EQUAL") {
    const share = amount / participants.length;

    for (let userId of participants) {
      if (userId.toString() !== paidBy.toString()) {
        await Balance.create({
          from: userId,
          to: paidBy,
          amount: share,
          groupId,
        });
      }
    }
  }

  // case 2: exact split
  if (splitType === "EXACT") {
    const total = Object.values(splits).reduce(
      (sum, val) => sum + val,
      0
    );

    if (total !== amount) {
      throw new Error("Exact split does not sum to total amount");
    }

    for (const [userId, userAmount] of Object.entries(splits)) {
      if (userId.toString() !== paidBy.toString()) {
        await Balance.create({
          from: userId,
          to: paidBy,
          amount: userAmount,
          groupId,
        });
      }
    }
  }

  // case 2: percentage split
  if (splitType === "PERCENT") {
    const total = Object.values(splits).reduce(
      (sum, val) => sum + val,
      0
    );

    
    if (Math.round(total) !== Math.round(amount)) {
      throw new Error("Percentage split must sum to total amount");
    }

    for (const [userId, userAmount] of Object.entries(splits)) {
      if (userId.toString() !== paidBy.toString()) {
        await Balance.create({
          from: userId,
          to: paidBy,
          amount: userAmount,
          groupId,
        });
      }
    }
  }
};

module.exports = { applySplit };