const mongoose = require("mongoose");
const Balance = require("../models/Balance");
const User = require("../models/User");

const getDashboard = async (req, res) => {
  try {
    const { userId } = req.params;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    //  Money that i owe (Payables)
    const youOweRaw = await Balance.aggregate([
      { $match: { from: userObjectId } },
      {
        $group: {
          _id: "$to",
          amount: { $sum: "$amount" },
        },
      },
    ]);

    //  Money that is owed to me(recievables)
    const owedToYouRaw = await Balance.aggregate([
      { $match: { to: userObjectId } },
      {
        $group: {
          _id: "$from",
          amount: { $sum: "$amount" },
        },
      },
    ]);

    // Collecting all the involved user IDs
    const userIds = [
      ...youOweRaw.map(item => item._id),
      ...owedToYouRaw.map(item => item._id),
    ];

    // Fetching the user names
    const users = await User.find({ _id: { $in: userIds } });

    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u.name;
    });

    //  Attach names
    const youOwe = youOweRaw.map(item => ({
      _id: item._id,
      name: userMap[item._id.toString()] || "Unknown",
      amount: item.amount,
    }));

    const owedToYou = owedToYouRaw.map(item => ({
      _id: item._id,
      name: userMap[item._id.toString()] || "Unknown",
      amount: item.amount,
    }));

    // Now Total
    const totalYouOwe = youOwe.reduce((sum, x) => sum + x.amount, 0);
    const totalOwedToYou = owedToYou.reduce((sum, x) => sum + x.amount, 0);

    res.json({
      youOwe,
      totalYouOwe,
      owedToYou,
      totalOwedToYou,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboard };