const express = require("express");
const cors = require("cors");
const db = require("./database");

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

  const sql = `
    INSERT INTO messages (name, email, message)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [name, email, message], function (err) {
    if (err) {
      console.error("Database save error:", err.message);

      return res.status(500).json({
        success: false,
        message: "Something went wrong while saving your message."
      });
    }

    console.log("\n==============================");
    console.log("🔥 MESSAGE SAVED TO DATABASE");
    console.log("==============================");
    console.log("ID:", this.lastID);
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);
    console.log("==============================\n");

    res.status(200).json({
      success: true,
      message: "Message saved successfully."
    });
  });
});

app.get("/api/messages", (req, res) => {
  const sql = `
    SELECT id, name, email, message, created_at
    FROM messages
    ORDER BY created_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Database read error:", err.message);

      return res.status(500).json({
        success: false,
        message: "Something went wrong while loading messages."
      });
    }

    res.status(200).json({
      success: true,
      messages: rows
    });
  });
});
app.delete("/api/messages/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM messages
    WHERE id = ?
  `;

  db.run(sql, [id], function (err) {
    if (err) {
      console.error("Database delete error:", err.message);

      return res.status(500).json({
        success: false,
        message: "Could not delete message."
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully."
    });
  });
});
app.put("/api/messages/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required."
    });
  }

  const sql = `
    UPDATE messages
    SET name = ?, email = ?, message = ?
    WHERE id = ?
  `;

  db.run(sql, [name, email, message, id], function (err) {
    if (err) {
      console.error("Database update error:", err.message);

      return res.status(500).json({
        success: false,
        message: "Could not update message."
      });
    }

    res.status(200).json({
      success: true,
      message: "Message updated successfully."
    });
  });
});

app.post("/api/newsletter", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required."
    });
  }

  const sql = `
    INSERT INTO subscribers (email)
    VALUES (?)
  `;

  db.run(sql, [email], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(400).json({
          success: false,
          message: "This email is already subscribed."
        });
      }

      return res.status(500).json({
        success: false,
        message: "Could not subscribe. Please try again."
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully subscribed to the newsletter."
    });
  });
});
app.get("/api/subscribers", (req, res) => {
  const sql = `
    SELECT id, email, created_at
    FROM subscribers
    ORDER BY created_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Database read error:", err.message);

      return res.status(500).json({
        success: false,
        message: "Something went wrong while loading subscribers."
      });
    }

    res.status(200).json({
      success: true,
      subscribers: rows
    });
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
