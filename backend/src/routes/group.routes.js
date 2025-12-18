const express = require("express");
const {
  createGroup,
  getGroupsForUser,
  getGroupById,
  addMemberByEmail,
  settleGroup
} = require("../controllers/group.controller");

const router = express.Router();

router.post("/", createGroup);
router.get("/", getGroupsForUser);      // /groups?userId=...
router.get("/:groupId", getGroupById);  // /groups/:groupId
router.post("/:groupId/add-member", addMemberByEmail);
router.post("/:groupId/settle", settleGroup);
router.post("/:groupId/settle", settleGroup);

module.exports = router;
