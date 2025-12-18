import { useState } from "react";
import API from "../services/api";

export default function Users() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const createUser = async () => {
    await API.post("/users", { name, email });
    alert("User created");
    setName("");
    setEmail("");
  };

  return (
    <div>
      <h2>Create User</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={createUser}>Create</button>
    </div>
  );
}
