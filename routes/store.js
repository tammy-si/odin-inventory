var express = require('express');
var router = express.Router();

var game_controller = require("../controllers/gameController");
var platform_controller = require("../controllers/platformController");
var studio_controller = require("../controllers/studioController");

/* GET home page. */
router.get('/', game_controller.index);

router.get('/games', game_controller.game_list);

module.exports = router;
