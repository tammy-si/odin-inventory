const asyncHandler = require("express-async-handler");

const Platform = require("../models/platform");

exports.platform_list = asyncHandler(async(req, res, next) => {
    const allPlatforms = await Platform.find();
    res.render("platform_list", {title: "Platforms", allPlatforms: allPlatforms})
})