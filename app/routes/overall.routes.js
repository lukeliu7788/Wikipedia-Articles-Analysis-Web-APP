var express = require('express')
var controller_Overall = require('../controllers/overall.controller.js')
var router = express.Router()


router.get('/ChartData',controller_Overall.ChartData);
router.get('/',controller_Overall.TopNRrevisions);
router.get('/',controller_Overall.BottomNRrevisions);
router.get('/',controller_Overall.MostRrevisions);
router.get('/',controller_Overall.LeastRrevisions);
router.get('/',controller_Overall.LongestRrevisions);
router.get('/',controller_Overall.ShortestRrevisions);
router.get('/', controller_Overall.showPage);

router.get('/change',controller_Overall.TopNRrevisions);
router.get('/change',controller_Overall.BottomNRrevisions);
router.get('/change',controller_Overall.changePage);

module.exports = router