const asyncHandler = require("express-async-handler");

const Studio = require("../models/studio");

exports.studio_list = asyncHandler(async(req, res, next) => {
    const allStudios = await Studio.find();
    res.render("studio_list", {title: "Studios", allStudios: allStudios})
})