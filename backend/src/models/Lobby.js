const { Schema, model } = require("mongoose");

const LobbySchema = new Schema({
  name: { type: String, required: true },
  image_url: { type: String, required: true },
});

const Lobby = model("Lobby", LobbySchema);

module.exports = {
  Lobby,
};


