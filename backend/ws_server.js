const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.get("/", (req, res) => res.send("CourtSim WebSocket Server"));

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const rooms = {}; // { roomId: { state, participants } }

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on("joinRoom", ({ roomId, participant }) => {
    socket.join(roomId);
    rooms[roomId] = rooms[roomId] || {
      state: { stage: "lobby" },
      participants: {},
    };
    rooms[roomId].participants[socket.id] = participant || {
      id: socket.id,
      name: "Guest",
      role: "observer",
    };
    io.to(roomId).emit("roomUpdate", {
      participants: Object.values(rooms[roomId].participants),
      state: rooms[roomId].state,
    });
  });

  socket.on("leaveRoom", ({ roomId }) => {
    socket.leave(roomId);
    if (rooms[roomId]) {
      delete rooms[roomId].participants[socket.id];
      io.to(roomId).emit("roomUpdate", {
        participants: Object.values(rooms[roomId].participants),
        state: rooms[roomId].state,
      });
    }
  });

  socket.on("changeState", ({ roomId, newState }) => {
    if (!rooms[roomId]) return;
    rooms[roomId].state = { ...rooms[roomId].state, ...newState };
    io.to(roomId).emit("stateChanged", rooms[roomId].state);
  });

  socket.on("chatMessage", ({ roomId, message }) => {
    io.to(roomId).emit("chatMessage", {
      from: socket.id,
      message,
      time: Date.now(),
    });
  });

  socket.on("disconnect", () => {
    for (const [roomId, room] of Object.entries(rooms)) {
      if (room.participants[socket.id]) {
        delete room.participants[socket.id];
        io.to(roomId).emit("roomUpdate", {
          participants: Object.values(room.participants),
          state: room.state,
        });
      }
    }
    console.log("socket disconnected", socket.id);
  });
});

httpServer.listen(4000, () =>
  console.log("WebSocket server listening on 4000")
);
