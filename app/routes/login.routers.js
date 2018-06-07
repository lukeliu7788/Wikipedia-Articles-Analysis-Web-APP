var express = require('express');
var router = express.Router();
var controller = require('../controllers/login.controller.js')

//GET route
router.get('/',controller.showIndex)
router.get('/main',controller.showMain)
router.get('/logout',controller.logout)
router.post('/register',controller.register)
router.post('/',controller.login)

module.exports=router;