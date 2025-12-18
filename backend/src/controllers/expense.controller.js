const Expense = require("../models/Expense");
const { applySplit } = require("../services/split.service");

const addExpense = async (req, res) => {
  try {
    // 🔥 DEBUG LOG
    console.log("========== ADD EXPENSE REQUEST ==========");
    console.log("BODY:", JSON.stringify(req.body, null, 2));
    console.log("========================================");

    const {
      description,
      amount,
      paidBy,
      groupId,
      splitType,
      participants,
      splits,
    } = req.body;

    // ✅ BASIC VALIDATIONS
    if (!description || !amount || !paidBy || !groupId || !splitType) {
      throw new Error("Missing required fields");
    }

    if (!participants || participants.length === 0) {
      throw new Error("Participants required");
    }

    // 🔥 THIS IS THE FIX
    // Convert splits ARRAY → MAP (userId -> amount)
    let splitsMap = {};

    if (splitType !== "EQUAL") {
      if (!splits || !Array.isArray(splits)) {
        throw new Error("Splits array required for EXACT / PERCENT");
      }

      if (splits.length !== participants.length) {
        throw new Error("Splits must be provided for all participants");
      }

      splits.forEach(s => {
        if (!s.userId || typeof s.amount !== "number") {
          throw new Error("Invalid split format");
        }
        splitsMap[s.userId] = s.amount;
      });
    }

    console.log("FINAL SPLITS MAP:", splitsMap);

    // ✅ CREATE EXPENSE (Mongo expects MAP, not array)
    const expense = await Expense.create({
      description,
      amount,
      paidBy,
      groupId,
      splitType,
      splits: splitType === "EQUAL" ? {} : splitsMap,
    });

    // ✅ APPLY SPLIT LOGIC
    await applySplit({
      groupId,
      paidBy,
      amount,
      splitType,
      participants,
      splits: splitsMap,
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("❌ ADD EXPENSE ERROR:", error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { addExpense };