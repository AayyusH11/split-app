import { useEffect, useState } from "react";
import API from "../services/api";

function GroupDetails({ group, onBack }) {
  const [balances, setBalances] = useState([]);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [paidBy, setPaidBy] = useState(group.members[0]._id);
  const [splitType, setSplitType] = useState("EQUAL");

  // For Exact / Percentage splits
  const [splits, setSplits] = useState({});

  // ID → Name map
  const [usersMap, setUsersMap] = useState({});

  const fetchBalances = () => {
    API.get(`/balances/${group._id}`)
      .then(res => setBalances(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchBalances();

    // Build users map
    const map = {};
    group.members.forEach(m => {
      map[m._id] = m.name;
    });
    setUsersMap(map);

    // Init split values
    const init = {};
    group.members.forEach(m => {
      init[m._id] = "";
    });
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
    setSplits({});
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#111",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: "720px",
          background: "#1c1c1c",
          padding: "30px",
          borderRadius: "8px",
        }}
      >
        <button onClick={onBack}>⬅ Back</button>

        <h1 style={{ textAlign: "center" }}>{group.name}</h1>

        {/* ADD EXPENSE */}
        <h3>Add Expense</h3>

        <input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ width: "100%", marginBottom: "8px" }}
        />

        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{ width: "100%", marginBottom: "8px" }}
        />

        <label>Paid By:</label>
        <select
          value={paidBy}
          onChange={e => setPaidBy(e.target.value)}
          style={{ width: "100%", marginBottom: "8px" }}
        >
          {group.members.map(m => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>

        <label>Split Type:</label>
        <select
          value={splitType}
          onChange={e => setSplitType(e.target.value)}
          style={{ width: "100%", marginBottom: "12px" }}
        >
          <option value="EQUAL">Equal</option>
          <option value="EXACT">Exact</option>
          <option value="PERCENT">Percentage</option>
        </select>

        {/* EXACT / PERCENT INPUTS */}
        {splitType !== "EQUAL" && (
          <div style={{ marginBottom: "12px" }}>
            <h4>
              {splitType === "EXACT"
                ? "Enter Exact Amounts"
                : "Enter Percentages"}
            </h4>

            {group.members.map(m => (
              <div
                key={m._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <span>{m.name}</span>
                <input
                  type="number"
                  placeholder={splitType === "EXACT" ? "₹" : "%"}
                  value={splits[m._id]}
                  onChange={e =>
                    setSplits({
                      ...splits,
                      [m._id]: e.target.value,
                    })
                  }
                  style={{ width: "90px" }}
                />
              </div>
            ))}
          </div>
        )}

        <button onClick={addExpense}>Add Expense</button>

        <hr style={{ margin: "25px 0" }} />

        {/* BALANCES */}
        <h3>Group Balances</h3>

        {balances.length === 0 ? (
          <p>No outstanding balances.</p>
        ) : (
          balances.map((b, index) => (
            <p key={index}>
              <b>{usersMap[b.from]}</b> owes{" "}
              <b>{usersMap[b.to]}</b> ₹{b.amount}
            </p>
          ))
        )}

        <hr />

        <button onClick={settleGroup}>Settle Group</button>
      </div>
    </div>
  );
}

export default GroupDetails;