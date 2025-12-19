const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    splitType: {
      type: String,
      enum: ["EQUAL", "EXACT", "PERCENT"],
      required: true,
    },

   
    splits: {
      type: Map,
      of: Number, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
