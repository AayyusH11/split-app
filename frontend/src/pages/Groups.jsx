import { useState } from "react";
import API from "../services/api";

export default function Groups() {
  const [name, setName] = useState("");
  const [members, setMembers] = useState("");

  const createGroup = async () => {
    const memberIds = members.split(",").map((id) => id.trim());
    await API.post("/groups", { name, members: memberIds });
    alert("Group created");
  };

  return (
    <div>
      <h2>Create Group</h2>

      <input
        placeholder="Group Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        placeholder="Member IDs (comma separated)"
        value={members}
        onChange={(e) => setMembers(e.target.value)}
      />

      <button onClick={createGroup}>Create Group</button>
    </div>
  );
}
