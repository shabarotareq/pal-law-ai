const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// إنشاء تطبيق Express
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => res.send("CourtSim WebSocket Server"));

// إنشاء HTTP Server
const httpServer = http.createServer(app);

// إنشاء WebSocket Server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // ⚠️ ضع رابط الواجهة في الإنتاج
    methods: ["GET", "POST"],
  },
});

// الغرف: { roomId: { state, participants, players } }
const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // الانضمام إلى غرفة
  socket.on("joinRoom", ({ roomId, participant, playerData }) => {
    socket.join(roomId);

    // إنشاء الغرفة إذا لم تكن موجودة
    if (!rooms[roomId]) {
      rooms[roomId] = {
        state: { stage: "lobby" },
        participants: {},
        players: [],
      };
    }

    // إضافة المشارك إذا تم تقديم بيانات المشارك
    if (participant) {
      rooms[roomId].participants[socket.id] = {
        id: socket.id,
        name: participant.name || "Guest",
        role: participant.role || "observer",
        ...participant,
      };
    }

    // إضافة لاعب إذا تم تقديم بيانات اللاعب
    if (playerData) {
      const player = {
        id: playerData.id || socket.id,
        role: playerData.role,
        position: playerData.position || [0, 0, 0],
      };

      // إزالة اللاعب إذا كان موجوداً مسبقاً
      rooms[roomId].players = rooms[roomId].players.filter(
        (p) => p.id !== player.id
      );
      rooms[roomId].players.push(player);
    }

    // إرسال تحديث الغرفة لكل المشاركين
    io.to(roomId).emit("roomUpdate", {
      participants: Object.values(rooms[roomId].participants),
      players: rooms[roomId].players,
      state: rooms[roomId].state,
    });

    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // حركة اللاعب
  socket.on("move", ({ id, pos, roomId = "main" }) => {
    const room = rooms[roomId];
    if (!room) return;

    const player = room.players.find((p) => p.id === id);
    if (player) {
      player.position = pos;
      io.to(roomId).emit("playerMoved", { id, pos });
    }
  });

  // تغيير حالة الغرفة
  socket.on("changeState", ({ roomId, newState }) => {
    if (!rooms[roomId]) return;
    rooms[roomId].state = { ...rooms[roomId].state, ...newState };
    io.to(roomId).emit("stateChanged", rooms[roomId].state);
  });

  // إرسال رسالة شات
  socket.on("chatMessage", ({ roomId, message }) => {
    const participant = rooms[roomId]?.participants[socket.id];
    if (participant) {
      io.to(roomId).emit("chatMessage", {
        from: participant.name || socket.id,
        message,
        time: Date.now(),
        role: participant.role,
      });
    }
  });

  // الخروج من الغرفة
  socket.on("leaveRoom", ({ roomId }) => {
    socket.leave(roomId);
    if (rooms[roomId]) {
      // إزالة المشارك
      delete rooms[roomId].participants[socket.id];

      // إزالة اللاعب
      rooms[roomId].players = rooms[roomId].players.filter(
        (p) => p.id !== socket.id
      );

      // إرسال تحديث الغرفة لكل المشاركين
      io.to(roomId).emit("roomUpdate", {
        participants: Object.values(rooms[roomId].participants),
        players: rooms[roomId].players,
        state: rooms[roomId].state,
      });
    }
  });

  // التعامل مع قطع الاتصال
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // إزالة المستخدم من جميع الغرف
    for (const [roomId, room] of Object.entries(rooms)) {
      if (
        room.participants[socket.id] ||
        room.players.some((p) => p.id === socket.id)
      ) {
        // إزالة المشارك
        delete room.participants[socket.id];

        // إزالة اللاعب
        room.players = room.players.filter((p) => p.id !== socket.id);

        // إرسال تحديث الغرفة لكل المشاركين
        io.to(roomId).emit("roomUpdate", {
          participants: Object.values(room.participants),
          players: room.players,
          state: room.state,
        });
      }
    }
  });

  // حدث disconnecting للتعامل مع الغرف المتعددة
  socket.on("disconnecting", () => {
    const socketRooms = Array.from(socket.rooms);
    socketRooms.forEach((roomId) => {
      if (rooms[roomId]) {
        // إزالة اللاعب من الغرفة
        rooms[roomId].players = rooms[roomId].players.filter(
          (p) => p.id !== socket.id
        );
        io.to(roomId).emit("updatePlayers", rooms[roomId].players);
      }
    });
  });
});

// تشغيل الخادم
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server listening on port ${PORT}`);
});

// واجهات API إضافية
app.get("/api/rooms", (req, res) => {
  const roomList = Object.keys(rooms).map((roomId) => ({
    roomId,
    participantCount: Object.keys(rooms[roomId].participants).length,
    playerCount: rooms[roomId].players.length,
    state: rooms[roomId].state,
  }));
  res.json(roomList);
});

app.get("/api/rooms/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  if (rooms[roomId]) {
    res.json({
      roomId,
      participants: Object.values(rooms[roomId].participants),
      players: rooms[roomId].players,
      state: rooms[roomId].state,
    });
  } else {
    res.status(404).json({ error: "Room not found" });
  }
});
