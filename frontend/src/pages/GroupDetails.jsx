import { useEffect, useState } from "react";
import API from "../services/api";

function GroupDetails({ group, onBack }) {
  const [balances, setBalances] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paidBy, setPaidBy] = useState(group.members[0]._id);
  const [splitType, setSplitType] = useState("EQUAL");
  const [splits, setSplits] = useState({});
  const [usersMap, setUsersMap] = useState({});

  const fetchBalances = () => {
    API.get(`/balances/${group._id}`)
      .then(res => setBalances(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchBalances();

    const map = {};
    const init = {};
    group.members.forEach(m => {
      map[m._id] = m.name;
      init[m._id] = "";
    });

    setUsersMap(map);
    setSplits(init);
  }, [group]);

  const addExpense = async () => {
    if (!amount || !description) {
      alert("Enter amount and description");
      return;
    }

    let splitsArray = [];

    if (splitType !== "EQUAL") {
      const values = Object.values(splits).map(Number);
      if (values.some(v => isNaN(v))) {
        alert("Enter split for all members");
        return;
      }

      const sum = values.reduce((a, b) => a + b, 0);

      if (splitType === "EXACT" && sum !== Number(amount)) {
        alert("Exact split must sum to total amount");
        return;
      }

      if (splitType === "PERCENT" && sum !== 100) {
        alert("Percentage split must sum to 100");
        return;
      }

      splitsArray = Object.entries(splits).map(([userId, value]) => ({
        userId,
        amount:
          splitType === "PERCENT"
            ? (Number(value) / 100) * Number(amount)
            : Number(value),
      }));
    }

    await API.post("/expenses", {
      description,
      amount: Number(amount),
      paidBy,
      groupId: group._id,
      participants: group.members.map(m => m._id),
      splitType,
      splits: splitsArray,
    });

    setAmount("");
    setDescription("");
    fetchBalances();
  };

  const settleGroup = async () => {
    await API.post(`/groups/${group._id}/settle`);
    setBalances([]);
    alert("Group settled successfully");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={card}>
          <button onClick={onBack} style={backBtn}>⬅ Back</button>
          <h1 style={{ margin: 0, color: "#1e293b" }}>{group.name}</h1>
        </div>

        <div style={grid}>

          {/* Add Expense */}
          <div style={card}>
            <h2 style={sectionTitle}>Add Expense</h2>

            <input
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={input}
            />

            <input
              placeholder="Amount (₹)"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={input}
            />

            <select value={paidBy} onChange={e => setPaidBy(e.target.value)} style={input}>
              {group.members.map(m => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>

            <select value={splitType} onChange={e => setSplitType(e.target.value)} style={input}>
              <option value="EQUAL">Equal</option>
              <option value="EXACT">Exact</option>
              <option value="PERCENT">Percent</option>
            </select>

            {splitType !== "EQUAL" && (
              <div style={splitBox}>
                {group.members.map(m => (
                  <div key={m._id} style={splitRow}>
                    <span>{m.name}</span>
                    <input
                      type="number"
                      value={splits[m._id]}
                      onChange={e => setSplits({ ...splits, [m._id]: e.target.value })}
                      style={splitInput}
                    />
                  </div>
                ))}
              </div>
            )}

            <button onClick={addExpense} style={primaryBtn}>Add Expense</button>
          </div>

          {/* Balances */}
          <div style={card}>
            <h2 style={sectionTitle}>Group Balances</h2>

            {balances.length === 0 ? (
              <p style={{ color: "#16a34a", fontWeight: "600" }}>
               
              </p>
            ) : (
              balances.map((b, i) => (
                <div key={i} style={balanceItem}>
                  <b>{usersMap[b.from]}</b> owes <b>{usersMap[b.to]}</b>
                  <div style={{ fontWeight: "700" }}>₹{b.amount}</div>
                </div>
              ))
            )}

            <button onClick={settleGroup} style={successBtn}>
              Settle Group
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* Doing styling from here  */

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "24px",
};

const card = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "24px",
  marginBottom: "24px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
};

const sectionTitle = {
  marginBottom: "16px",
  color: "#1e293b",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
};

const splitBox = {
  background: "#f8fafc",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "12px",
};

const splitRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
};

const splitInput = {
  width: "80px",
  padding: "6px",
};

const primaryBtn = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const successBtn = {
  ...primaryBtn,
  background: "#16a34a",
  marginTop: "12px",
};

const backBtn = {
  marginBottom: "12px",
  background: "#e2e8f0",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

const balanceItem = {
  padding: "10px",
  marginBottom: "8px",
  background: "#f1f5f9",
  borderRadius: "6px",
};

export default GroupDetails;
