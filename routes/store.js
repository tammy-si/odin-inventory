var express = require('express');
var router = express.Router();

var game_controller = require("../controllers/gameController");
var platform_controller = require("../controllers/platformController");
var studio_controller = require("../controllers/studioController");

/* GET home page. */
router.get('/', game_controller.index);

router.get('/games', game_controller.game_list);

router.get('/games/add', game_controller.game_add_get);

router.post('/games/add', game_controller.game_add_post);

router.get('/games/:id', game_controller.game_detail);

router.get('/games/:id/delete', game_controller.game_delete);


/* studios route */
router.get('/studios', studio_controller.studio_list);

router.get('/studios/add', studio_controller.studio_add_get);

router.post('/studios/add', studio_controller.studio_add_post);

router.get('/studios/:id', studio_controller.studio_detail);

router.get('/studios/:id/delete', studio_controller.studio_delete);

/* platforms route */
router.get('/platforms', platform_controller.platform_list);

router.get('/platforms/add', platform_controller.platform_add_get);

router.post('/platforms/add', platform_controller.platform_add_post);

router.get('/platforms/:id', platform_controller.platform_detail);

router.get('/platforms/:id/delete', platform_controller.platform_delete);

module.exports = router;
