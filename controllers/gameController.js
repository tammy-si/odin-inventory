const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
var XMLHttpRequest = require('xhr2');


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

exports.game_add_post = [
    // Convert the platform to an array.
    (req, res, next) => {
    if (!(req.body.platform instanceof Array)) {
      if (typeof req.body.platform === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    // for studio
    if (req.body.studio == '') {
        req.body.studio = null;
    }
    // for the image
    var http = new XMLHttpRequest();
    http.open('GET', req.body.img_url, true);
    try {
        http.send()
    } catch {
        req.body.img_url = 'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg';
    };
    next();
  },
    // turn all the platforms into an array
    body('title', 'Title must not be empty')
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("description", "Please enter a description")
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("platform.*").escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        // create a new Game
        const game = new Game({
            title: req.body.title,
            studio: req.body.studio,
            description: req.body.description,
            price: req.body.price,
            num_in_stock: req.body.num_in_stock,
            img_url: req.body.img_url,
            platforms: req.body.platform    
        })     
        if (!errors.isEmpty()) {
            const [allStudios, allPlatforms] = await Promise.all([
                Studio.find().exec(),
                Platform.find().exec()
            ]) 
            res.render("game_form", {title: "Add Game", allStudios:allStudios, allPlatforms:allPlatforms});        
        } else {
            await game.save();
            res.redirect(game.url);
        }
    })
]

exports.game_delete = asyncHandler(async(req, res, next) => {
    await Game.findByIdAndDelete(req.params.id);
    res.redirect('/store/games/');
})

exports.game_update_get = asyncHandler(async(req, res, next) => {
    // get info
    const [game, allStudios, allPlatforms] = await Promise.all([
        Game.findById(req.params.id).populate("studio").populate("platforms").exec(),
        Studio.find().exec(),
        Platform.find().exec()
    ])

    if (game === null) {
        const err = new Error("Game not found");
        err.status = 404;
        return next(err);    
    }

    // check the platform
    for (platform of allPlatforms) {
        for (game_platform of game.platforms) {
            if (platform._id.toString() === game_platform._id.toString()) {
                platform.checked = "true";
            }
        }
    }

    res.render("game_form", {
        title: "Update game",
        allStudios: allStudios,
        allPlatforms: allPlatforms,
        game: game
    })
})

exports.game_update_post = [
    // Convert the platform to an array.
    (req, res, next) => {
    if (!(req.body.platform instanceof Array)) {
      if (typeof req.body.platform === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    // for studio
    if (req.body.studio == '') {
        req.body.studio = null;
    }
    // for the image
    var http = new XMLHttpRequest();
    http.open('GET', req.body.img_url, true);
    try {
        http.send()
    } catch {
        req.body.img_url = 'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg';
    };
    next();
  },
    // turn all the platforms into an array
    body('title', 'Title must not be empty')
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("description", "Please enter a description")
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("platform.*").escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        // create a new Game
        const game = new Game({
            title: req.body.title,
            studio: req.body.studio,
            description: req.body.description,
            price: req.body.price,
            num_in_stock: req.body.num_in_stock,
            img_url: req.body.img_url,
            platforms: req.body.platform,
            _id: req.params.id      // keep old id
        })     
        if (!errors.isEmpty()) {
            const [game, allStudios, allPlatforms] = await Promise.all([
                Game.findById(req.params.id).populate("studio").populate("platforms").exec(),
                Studio.find().exec(),
                Platform.find().exec()
            ])


            // check the platform
            for (platform of allPlatforms) {
                for (game_platform of game.platforms) {
                    if (platform._id.toString() === game_platform._id.toString()) {
                        platform.checked = "true";
                    }
                }
            }
        
            res.render("game_form", {
                title: "Update game",
                allStudios: allStudios,
                allPlatforms: allPlatforms,
                game: game,
            })
        } else {
            var thegame = await Game.findByIdAndUpdate(req.params.id, game, {})
            res.redirect(thegame.url);
        }
    })
]
