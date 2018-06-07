var express = require('express')
//var controller_Overall = require('../controllers/Overallcontroller.js')
var controller_Article = require('../controllers/individual.controller')
var router = express.Router()

router.get('/',controller_Article.getTitle)
//router.get('/',controller_Overall.OverAllstatic);

router.get('/update',controller_Article.update)
//router.get('/', controller_Overall.showPage);

router.get('/getArticleData',controller_Article.getAdmin)
router.get('/getArticleData',controller_Article.getAnon)
router.get('/getArticleData',controller_Article.getBot)
router.get('/getArticleData',controller_Article.getTop5)
router.get('/getArticleData',controller_Article.getTotal)
router.get('/getArticleData',controller_Article.getUser)

router.get('/getTop5Data',controller_Article.getTop5Data)

module.exports = router