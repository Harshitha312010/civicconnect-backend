require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/issues", require("./routes/issueRoutes"));

app.get("/", (req, res) => {
  res.send("CivicConnect Backend is Running");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});