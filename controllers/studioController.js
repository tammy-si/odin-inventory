const asyncHandler = require("express-async-handler");

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

exports.game_add_post = asyncHandler(async (req, res, next) => {

})
