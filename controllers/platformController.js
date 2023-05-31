const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
var XMLHttpRequest = require('xhr2');

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

exports.platform_add_post = [
    (req, res, next) => {
        // for the image
        var http = new XMLHttpRequest();
        http.open('HEAD', req.body.img_url, false);
        try {
            http.send()
        } catch {
            req.body.img_url = 'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg';
        };
        next();
    },
    // turn all the platforms into an array
    body('name', 'Name must not be empty')
        .trim()
        .isLength({ min: 1})
        .escape(),
    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);
        // create a new Game
        const platform = new Platform({
            name: req.body.name,
            platforms: req.body.platform    
        })     
        if (!errors.isEmpty()) {
            res.render("platform_form", {title: "Add Platform"});
        } else {
            await platform.save();
            res.redirect(platform.url);
        }
    })
]

exports.platform_delete = asyncHandler(async(req, res, next) => {
    // have to delete platform from any game with this as platform
    await Game.updateMany({}, {$pull: { platforms: {$in : [req.params.id]}}}).exec();
    // delete the actual platform
    await Platform.findByIdAndDelete(req.params.id);
    res.redirect('/store/platforms/');
})