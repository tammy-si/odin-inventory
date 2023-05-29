const asyncHandler = require("express-async-handler");

const Game = require("../models/game");
const Platform = require("../models/platform");
const Studio = require("../models/studio");

exports.index = asyncHandler(async (req, res, next) => {
    const [gameCount, platformCount, studioCount] = await Promise.all([
        Game.countDocuments().exec(),
        Platform.countDocuments().exec(),
        Studio.countDocuments().exec()
    ])
    res.render("index", {title: "Fake-Game-Store", gameCount: gameCount, platformCount: platformCount, studioCount: studioCount})
})

exports.game_list = asyncHandler(async (req, res, next) => {
    var allGames = await Game.find();
    res.render("game_list", {title: "Games", allGames: allGames})
});

exports.game_detail = asyncHandler(async (req, res, next) => {
    const game = await Game.findById(req.params.id).populate("studio").populate("platforms").exec();
    res.render("game_details", {title: "Games", game: game})
});

