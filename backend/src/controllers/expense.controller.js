const Expense = require("../models/Expense");
const { applySplit } = require("../services/split.service");

const addExpense = async (req, res) => {
  try {
    // this have written to debug the issue 
    console.log("Add Expense Request");
    console.log("BODY:", JSON.stringify(req.body, null, 2));
    

    const {
      description,
      amount,
      paidBy,
      groupId,
      splitType,
      participants,
      splits,
    } = req.body;

    
    if (!description || !amount || !paidBy || !groupId || !splitType) {
      throw new Error("Missing required fields");
    }

    if (!participants || participants.length === 0) {
      throw new Error("Participants required");
    }

    // here i was getting the issue finally spotted it 
    
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

    
    const expense = await Expense.create({
      description,
      amount,
      paidBy,
      groupId,
      splitType,
      splits: splitType === "EQUAL" ? {} : splitsMap,
    });

    // here its the split logic 
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
    console.error("ADD EXPENSE ERROR:", error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { addExpense };