const express = require("express");
const { settleDues } = require("../controllers/settle.controller");

const router = express.Router();

router.post("/", settleDues);

module.exports = router;
