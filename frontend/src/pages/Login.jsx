import { useEffect, useState } from "react";
import API from "../services/api";

function Login({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Fetch existing users
  useEffect(() => {
    API.get("/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  // Create new user
  const createUser = async () => {
    if (!name || !email) {
      alert("Enter name and email");
      return;
    }

    const res = await API.post("/users", { name, email });
    onSelectUser(res.data);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: "8px",
            color: "#1e293b",
          }}
        >
          Split App
        </h1>
        <p
          style={{
            textAlign: "center",
            marginBottom: "24px",
            color: "#475569",
            fontSize: "14px",
          }}
        >
          Select a user or create a new one
        </p>

        {/* Existing Users */}
        <h3 style={{ marginBottom: "10px", color: "#334155" }}>
          Existing Users
        </h3>

        <div
          style={{
            maxHeight: "180px",
            overflowY: "auto",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {users.length === 0 ? (
            <p style={{ padding: "12px", color: "#64748b" }}>
              No users found
            </p>
          ) : (
            users.map(user => (
              <button
                key={user._id}
                onClick={() => onSelectUser(user)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  borderBottom: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <strong>{user.name}</strong>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  {user.email}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Create User */}
        <h3 style={{ marginBottom: "10px", color: "#334155" }}>
          Create New User
        </h3>

        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
          }}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "16px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
          }}
        />

        <button
          onClick={createUser}
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Create & Enter
        </button>
      </div>
    </div>
  );
}

export default Login;