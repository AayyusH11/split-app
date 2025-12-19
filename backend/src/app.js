const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const groupRoutes = require("./routes/group.routes");
const expenseRoutes = require("./routes/expense.routes");
const balanceRoutes = require("./routes/balance.routes");
const settleRoutes = require("./routes/settle.routes");
const dashboardRoutes = require("./routes/dashboard.routes");


const app = express();

app.use(cors());

app.use(express.json());

app.use("/users", userRoutes);
app.use("/groups", groupRoutes);
app.use("/expenses", expenseRoutes);
app.use("/balances", balanceRoutes);
app.use("/settle", settleRoutes);
app.use("/dashboard",dashboardRoutes)


module.exports = app;
