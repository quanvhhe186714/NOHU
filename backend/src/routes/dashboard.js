const express = require("express");
const { auth } = require("../middleware/auth");
const { Lobby } = require("../models/Lobby");
const { Game } = require("../models/Game");

const router = express.Router();

// GET /api/dashboard - list lobbies
router.get("/", auth(), async (_req, res) => {
  try {
    const lobbies = await Lobby.find();
    // Transform _id to id for frontend compatibility
    const transformedLobbies = lobbies.map((lobby) => ({
      id: lobby._id.toString(),
      name: lobby.name,
      image_url: lobby.image_url,
    }));
    return res.json({ success: true, data: transformedLobbies });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: e.message || "Lỗi server" });
  }
});

// GET /api/dashboard/lobbies/:id/games - games by lobby
router.get("/lobbies/:id/games", auth(), async (req, res) => {
  try {
    const games = await Game.find({ lobby: req.params.id });
    // Transform _id to id for frontend compatibility
    const transformedGames = games.map((game) => ({
      id: game._id.toString(),
      name: game.name,
      vietnamese_name: game.vietnamese_name || "",
      image_url: game.image_url,
      label: game.label || "",
      label_color: game.label_color || "purple",
      win_rate: game.win_rate || 50,
      lobby: game.lobby.toString(),
    }));
    return res.json({ success: true, data: transformedGames });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: e.message || "Lỗi server" });
  }
});

module.exports = router;


