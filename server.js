require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;


const app = express();

connectDB();

app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/issues", require("./routes/issueRoutes"));

app.get("/", (req, res) => {
  res.send("CivicConnect Backend is Running");
});
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});