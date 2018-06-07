var express = require('express');
var router = express.Router();
var controller = require('../controllers/author.controller')

router.get('/getArticles',controller.getArticles)
// router.get('/getTimestamps',controller.getTimestamps)
// router.get('/',controller.showMain)

module.exports = router;