const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
var XMLHttpRequest = require('xhr2');


const Studio = require("../models/studio");
const Game = require("../models/game");

exports.studio_list = asyncHandler(async(req, res, next) => {
    const allStudios = await Studio.find().sort({name: 1});
    res.render("studio_list", {title: "Studios", allStudios: allStudios})
})

exports.studio_detail = asyncHandler(async (req, res, next) => {
    const [studio, allGamesByStudio] = await Promise.all([
        Studio.findById(req.params.id).exec(),
        Game.find({studio: req.params.id}).sort({title: 1}).exec()
    ]);
    if (studio === null) {
        // No results.
        const err = new Error("Studio not found");
        err.status = 404;
        return next(err);
    }
    res.render("studio_details", {title: "Studios", studio: studio, allGamesByStudio: allGamesByStudio})
});

exports.studio_add_get = asyncHandler(async (req, res, next) => {
    res.render("studio_form", {title: "Add Studio"});
})

exports.studio_add_post = [
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
        const studio = new Studio({
            name: req.body.name,
            platforms: req.body.platform    
        })     
        if (!errors.isEmpty()) {
            res.render("studio_form", {title: "Add Studio"});
        } else {
            await studio.save();
            res.redirect(studio.url);
        }
    })
]

exports.studio_delete = asyncHandler(async(req, res, next) => {
    // have to delete studio from any game with this as studio
    await Game.updateMany({ studio:req.params.id}, {studio: null}).exec();
    // delete the actual platform
    await Studio.findByIdAndDelete(req.params.id);
    res.redirect('/store/studios/');
})

exports.studio_update_get = asyncHandler(async(req, res, next) => {
    const studio = await Studio.findById(req.params.id).exec();
    res.render("studio_form", {title: "Update studio", studio: studio})
}) 

exports.studio_update_post = [
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
        const studio = new Studio({
            name: req.body.name,
            platforms: req.body.platform, 
            _id: req.params.id 
        })     
        if (!errors.isEmpty()) {
            const studio = await Studio.findById(req.params.id).exec();
            res.render("studio_form", {title: "Update studio", studio: studio})
        } else {
            const thestudio = await Studio.findByIdAndUpdate(req.params.id, studio)
            res.redirect(thestudio.url);
        }
    })
]