import { useState } from "react";
import API from "../services/api";

export default function Expenses() {
  const [data, setData] = useState({
    description: "",
    amount: "",
    paidBy: "",
    groupId: "",
    splitType: "EQUAL",
    participants: "",
  });

  const addExpense = async () => {
    await API.post("/expenses", {
      ...data,
      amount: Number(data.amount),
      participants: data.participants.split(",").map((p) => p.trim()),
    });
    alert("Expense added");
  };

  return (
    <div>
      <h2>Add Expense</h2>

      <input placeholder="Description" onChange={(e) => setData({ ...data, description: e.target.value })} />
      <input placeholder="Amount" onChange={(e) => setData({ ...data, amount: e.target.value })} />
      <input placeholder="Paid By (User ID)" onChange={(e) => setData({ ...data, paidBy: e.target.value })} />
      <input placeholder="Group ID" onChange={(e) => setData({ ...data, groupId: e.target.value })} />

      <select onChange={(e) => setData({ ...data, splitType: e.target.value })}>
        <option value="EQUAL">EQUAL</option>
        <option value="EXACT">EXACT</option>
        <option value="PERCENT">PERCENT</option>
      </select>

      <textarea
        placeholder="Participants (comma separated IDs)"
        onChange={(e) => setData({ ...data, participants: e.target.value })}
      />

      <button onClick={addExpense}>Add Expense</button>
    </div>
  );
}
