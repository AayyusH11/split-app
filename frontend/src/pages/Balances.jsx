import { useState } from "react";
import API from "../services/api";

export default function Balances() {
  const [groupId, setGroupId] = useState("");
  const [balances, setBalances] = useState([]);

  const fetchBalances = async () => {
    const res = await API.get(`/balances/${groupId}`);
    setBalances(res.data);
  };

  const settle = async (from, to, amount) => {
    await API.post("/settle", { from, to, amount });
    fetchBalances();
  };

  return (
    <div>
      <h2>Balances</h2>

      <input
        placeholder="Group ID"
        onChange={(e) => setGroupId(e.target.value)}
      />

      <button onClick={fetchBalances}>Get Balances</button>

      <ul>
        {balances.map((b, i) => (
          <li key={i}>
            {b.from} owes {b.to} ₹{b.amount}
            <button onClick={() => settle(b.from, b.to, b.amount)}>
              Settle
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
