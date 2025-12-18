const Group = require("../models/Group");
const { settleGroupBalances } = require("../services/balance.service");

// Create group
const createGroup = async (req, res) => {
  try {
    const group = await Group.create(req.body);
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get groups for a user
const getGroupsForUser = async (req, res) => {
  const { userId } = req.query;

  const groups = await Group.find({
    members: userId,
  }).populate("members", "name email");

  res.json(groups);
};

const getGroupById = async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findById(groupId).populate(
    "members",
    "name email"
  );

  if (!group) {
    return res.status(404).json({ error: "Group not found" });
  }

  res.json(group);
};

const User = require("../models/User");

const addMemberByEmail = async (req, res) => {
  const { groupId } = req.params;
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "No such user exists" });
  }

  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json({ error: "Group not found" });
  }

  if (group.members.includes(user._id)) {
    return res.status(400).json({ error: "User already in group" });
  }

  group.members.push(user._id);
  await group.save();

  res.json({ message: "User added to group", user });
};
const settleGroup = async (req, res) => {
  const { groupId } = req.params;

  await settleGroupBalances(groupId);

  res.json({ message: "Group settled successfully" });
};


module.exports = { createGroup, getGroupsForUser, getGroupById, addMemberByEmail,settleGroup };

