const asyncHandler = require("express-async-handler");

const Platform = require("../models/platform");
const Game = require("../models/game");


exports.platform_list = asyncHandler(async(req, res, next) => {
    const allPlatforms = await Platform.find().sort({name: 1}).exec();
    res.render("platform_list", {title: "Platforms", allPlatforms: allPlatforms})
})

exports.platform_detail = asyncHandler(async (req, res, next) => {
    const [platform, allGamesOnPlatform] = await Promise.all([
        Platform.findById(req.params.id).exec(),
        Game.find({platforms: req.params.id}).sort({title: 1}).exec()
    ]);
    if (platform === null) {
        // No results.
        const err = new Error("Platform not found");
        err.status = 404;
        return next(err);
    }
    res.render("platform_details", {title: "Platforms", platform: platform, allGamesOnPlatform: allGamesOnPlatform})
});


exports.platform_add_get = asyncHandler(async (req, res, next) => {
    res.render("platform_form", {title: "Add Platform"});
})

exports.platform_add_post = asyncHandler(async (req, res, next) => {

})