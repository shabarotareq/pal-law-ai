// server.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const pool = require("./config/db");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// ================== ROUTES ==================

// ✅ Welcome
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to PAL Law AI API (PostgreSQL Edition)",
    status: "Server is running!",
  });
});

// ✅ Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// ================== CASES CRUD ==================

// ➕ إنشاء قضية جديدة
app.post("/cases", async (req, res) => {
  const { case_number, title } = req.body;
  if (!case_number || !title) {
    return res
      .status(400)
      .json({ error: "case_number and title are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO cases (case_number, title) VALUES ($1, $2) RETURNING *",
      [case_number, title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database insert failed" });
  }
});

// 📖 جلب كل القضايا
app.get("/cases", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cases ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// 📖 جلب قضية واحدة
app.get("/cases/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cases WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Case not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// ✏️ تحديث قضية
app.put("/cases/:id", async (req, res) => {
  const { title, case_number } = req.body;
  try {
    const result = await pool.query(
      "UPDATE cases SET title = COALESCE($1, title), case_number = COALESCE($2, case_number) WHERE id = $3 RETURNING *",
      [title, case_number, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Case not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database update failed" });
  }
});

// ❌ حذف قضية
app.delete("/cases/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM cases WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Case not found" });
    res.json({ message: "Case deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database delete failed" });
  }
});

// ================== SOCKET.IO ==================
io.on("connection", (socket) => {
  console.log("⚖️ New client connected:", socket.id);

  // الانضمام إلى جلسة حسب رقم القضية
  socket.on("joinSession", ({ caseId, user }) => {
    socket.join(caseId);
    console.log(`👤 ${user} joined case ${caseId}`);
    io.to(caseId).emit("systemMessage", `${user} joined case ${caseId}`);
  });

  // إرسال رسالة محادثة
  socket.on("chatMessage", async ({ caseId, message, user }) => {
    const timestamp = new Date();

    try {
      await pool.query(
        "INSERT INTO messages (case_id, username, message, created_at) VALUES ($1, $2, $3, $4)",
        [caseId, user, message, timestamp]
      );
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }

    io.to(caseId).emit("chatMessage", { user, message, timestamp });
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
