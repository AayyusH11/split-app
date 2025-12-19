import { useEffect, useState } from "react";
import API from "../services/api";
import GroupDetails from "./GroupDetails";

function Dashboard({ user }) {
  const [dashboard, setDashboard] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [allUsers, setAllUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [selectedSettleUser, setSelectedSettleUser] = useState("");
  const [settleAmount, setSettleAmount] = useState("");

  const fetchDashboard = () => {
    API.get(`/dashboard/${user._id}`)
      .then(res => setDashboard(res.data))
      .catch(err => console.error(err));
  };

  const fetchGroups = () => {
    API.get(`/groups?userId=${user._id}`)
      .then(res => setGroups(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchDashboard();
    fetchGroups();

    API.get("/users")
      .then(res => setAllUsers(res.data))
      .catch(err => console.error(err));
  }, [user]);

  if (!dashboard) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "#fff",
        fontSize: "18px"
      }}>
        Loading...
      </div>
    );
  }

  if (selectedGroup) {
    return (
      <GroupDetails
        group={selectedGroup}
        onBack={() => setSelectedGroup(null)}
      />
    );
  }

  const createGroup = async () => {
    if (!groupName || selectedMembers.length === 0) {
      alert("Enter group name and select members");
      return;
    }

    await API.post("/groups", {
      name: groupName,
      members: selectedMembers,
    });

    setGroupName("");
    setSelectedMembers([]);
    fetchGroups();
  };

  const handlePartialSettle = async () => {
    if (!selectedSettleUser || !settleAmount) {
      alert("Select user and amount");
      return;
    }

    await API.post("/balances/settle", {
      from: user._id,
      to: selectedSettleUser,
      amount: Number(settleAmount),
    });

    setSelectedSettleUser("");
    setSettleAmount("");
    fetchDashboard();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "30px",
          marginBottom: "30px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          textAlign: "center"
        }}>
          <h1 style={{ margin: 0, color: "#1e293b" }}>Dashboard</h1>
          <p style={{ marginTop: "8px", color: "#475569" }}>
            Welcome, <b>{user.name}</b>
          </p>
        </div>

        {/* Layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px"
        }}>

          {/* PAYABLES & RECEIVABLES */}
          <div style={card}>
            <Section title="Payables" color="#dc2626">
              {dashboard.youOwe.length === 0
                ? <p>No payables </p>
                : dashboard.youOwe.map(i => (
                  <Item key={i._id} bg="#fef2f2" border="#dc2626">
                    You owe <b>{i.name}</b> ₹{i.amount}
                  </Item>
                ))
              }
              <Total bg="#fee2e2" color="#991b1b">
                Total ₹{dashboard.totalYouOwe}
              </Total>
            </Section>

            <Section title="Receivables" color="#16a34a">
              {dashboard.owedToYou.length === 0
                ? <p>No receivables</p>
                : dashboard.owedToYou.map(i => (
                  <Item key={i._id} bg="#f0fdf4" border="#16a34a">
                    <b>{i.name}</b> owes you ₹{i.amount}
                  </Item>
                ))
              }
              <Total bg="#dcfce7" color="#166534">
                Total ₹{dashboard.totalOwedToYou}
              </Total>
            </Section>

            <Section title="Settle Dues" color="#2563eb">
              {dashboard.youOwe.length === 0 ? (
                <p>No dues to settle</p>
              ) : (
                <>
                  <select
                    value={selectedSettleUser}
                    onChange={e => setSelectedSettleUser(e.target.value)}
                    style={input}
                  >
                    <option value="">Select person</option>
                    {dashboard.youOwe.map(i => (
                      <option key={i._id} value={i._id}>{i.name}</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Amount"
                    value={settleAmount}
                    onChange={e => setSettleAmount(e.target.value)}
                    style={input}
                  />

                  <button style={primaryBtn} onClick={handlePartialSettle}>
                    Settle Now
                  </button>
                </>
              )}
            </Section>
          </div>

          {/* GROUPS */}
          <div style={card}>
            <h2>My Groups</h2>
            {groups.length === 0 ? (
              <p>No groups yet</p>
            ) : groups.map(g => (
              <div
                key={g._id}
                onClick={() => setSelectedGroup(g)}
                style={groupItem}
              >
                {g.name}
              </div>
            ))}
          </div>

          {/* CREATE GROUP */}
          <div style={card}>
            <h2>Create Group</h2>

            <input
              placeholder="Group name"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              style={input}
            />

            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              {allUsers.map(u => (
                <label key={u._id} style={checkbox}>
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(u._id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedMembers([...selectedMembers, u._id]);
                      } else {
                        setSelectedMembers(
                          selectedMembers.filter(id => id !== u._id)
                        );
                      }
                    }}
                  />
                  {u.name}
                </label>
              ))}
            </div>

            <button style={successBtn} onClick={createGroup}>
              Create Group
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* Doing styling from here  */

const card = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.15)"
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #cbd5e0"
};

const primaryBtn = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const successBtn = {
  ...primaryBtn,
  background: "#16a34a",
  marginTop: "12px"
};

const groupItem = {
  padding: "12px",
  marginBottom: "8px",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  cursor: "pointer"
};

const checkbox = {
  display: "block",
  marginBottom: "6px"
};

const Section = ({ title, color, children }) => (
  <>
    <h3 style={{ borderBottom: `2px solid ${color}` }}>{title}</h3>
    {children}
    <hr />
  </>
);

const Item = ({ children, bg, border }) => (
  <div style={{
    background: bg,
    borderLeft: `4px solid ${border}`,
    padding: "10px",
    marginBottom: "6px"
  }}>
    {children}
  </div>
);

const Total = ({ children, bg, color }) => (
  <div style={{
    background: bg,
    color,
    padding: "10px",
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: "6px"
  }}>
    {children}
  </div>
);

export default Dashboard;
