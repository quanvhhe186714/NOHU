const { Schema, model } = require("mongoose");

const GameSchema = new Schema({
  name: { type: String, required: true },
  vietnamese_name: { type: String, default: "" },
  image_url: { type: String, required: true },
  label: { type: String, default: "" }, // e.g., "DRAGONS RETURNED", "10,000x", "MULTIPLIERS"
  label_color: { type: String, default: "purple" }, // purple, red, orange
  win_rate: { type: Number, default: 50 }, // 0-100
  lobby: { type: Schema.Types.ObjectId, ref: "Lobby", required: true },
});

const Game = model("Game", GameSchema);

module.exports = {
  Game,
};


