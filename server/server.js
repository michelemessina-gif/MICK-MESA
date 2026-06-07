const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Mick Mesa backend is running");
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all fields."
    });
  }

  console.log("\n==============================");
console.log("🔥 NEW CONTACT MESSAGE RECEIVED");
console.log("==============================");
console.log("Name:", name);
console.log("Email:", email);
console.log("Message:", message);
console.log("==============================\n");
  res.status(200).json({
    success: true,
    message: "Message received successfully."
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});