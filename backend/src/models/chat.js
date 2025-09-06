const mongoose = require("mongoose");
const ChatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    messages: [
      {
        role: { type: String }, // 'user' or 'bot' or 'system'
        content: { type: String },
        meta: { type: Object },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Chat", ChatSchema);
