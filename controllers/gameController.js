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
    var allGames = await Game.find().sort({title: 1}).exec();
    res.render("game_list", {title: "Games", allGames: allGames})
});

exports.game_detail = asyncHandler(async (req, res, next) => {
    const game = await Game.findById(req.params.id).populate("studio").populate("platforms").exec();
    if (game === null) {
        // No results.
        const err = new Error("Game not found");
        err.status = 404;
        return next(err);
    }
    res.render("game_details", {title: "Games", game: game})
});

exports.game_add_get = asyncHandler(async (req, res, next) => {
    const [allStudios, allPlatforms] = await Promise.all([
        Studio.find().exec(),
        Platform.find().exec()
    ]) 
    res.render("game_form", {title: "Add Game", allStudios:allStudios, allPlatforms:allPlatforms});
})

exports.game_add_post = asyncHandler(async (req, res, next) => {

})
