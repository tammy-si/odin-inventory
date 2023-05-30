var express = require('express');
var router = express.Router();

var game_controller = require("../controllers/gameController");
var platform_controller = require("../controllers/platformController");
var studio_controller = require("../controllers/studioController");

/* GET home page. */
router.get('/', game_controller.index);

router.get('/games', game_controller.game_list);

router.get('/games/:id', game_controller.game_detail);

/* studios route */
router.get('/studios', studio_controller.studio_list);


/* platforms route */
router.get('/platforms', platform_controller.platform_list);

module.exports = router;
