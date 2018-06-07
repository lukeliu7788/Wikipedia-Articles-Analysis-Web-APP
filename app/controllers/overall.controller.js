var express = require('express')
var Mongodb = require("../models/overall_model")
var fs = require('fs')

var admintxtpath = './public/admin.txt';
var bottxtpath ='./public/bot.txt';

var admin_array=fs.readFileSync(admintxtpath,'utf8').split("\n");
var bot_array=fs.readFileSync(bottxtpath,'utf8').split("\n");
Mongodb.add_usertype(bot_array,'bot');
Mongodb.add_usertype(admin_array,'admin');
Mongodb.Updateanon();

var YearUserArray;
module.exports.ChartData=function(req,res,next){
	Mongodb.YearUsertypeAna(function(err,result){
		if (err != 0){
			console.log('error')
			YearUserArray = 'error'
		}
		else{			

			console.log(result[0])
			res.json(result);
			next();
		}		
	})
}

var TopThreeRrevisions
var BottomThreeseRrevisions
var MostEditedArticle
var LeastEditedArticle
var LongestHistoryArticle
var ShortestHistoryArticle

module.exports.TopNRrevisions = function(req,res,next){
	var number = parseInt(req.query.number);
	Mongodb.NRrevisions(number,-1,function(err,result){
		if (err != 0){TopThreeRrevisions = 'error'}
		else{
			//TopThreeRrevisions = result[0]['_id']+", "+result[1]['_id']+", "+result[2]['_id'];
			TopThreeRrevisions = result;
			console.log(TopThreeRrevisions)
			next();
		}		
	})
}


module.exports.BottomNRrevisions = function(req,res,next){
	var number = parseInt(req.query.number);
	Mongodb.NRrevisions(number,1,function(err,result){
		if (err != 0){BottomThreeseRrevisions = 'error'}
		else{
			//BottomThreeseRrevisions = result[0]['_id']+", "+result[1]['_id']+", "+result[2]['_id'];	
			BottomThreeseRrevisions = result
			console.log(BottomThreeseRrevisions)
			next();
		}		
	})
}

module.exports.MostRrevisions = function(req,res,next){
	Mongodb.MostLeastEdited(-1,function(err,result){
		if (err != 0){MostEditedArticle = 'error'}
		else{
			MostEditedArticle = result[0]['_id'];
			console.log(MostEditedArticle)
			next();
		}		
	})
}



module.exports.LeastRrevisions = function(req,res,next){
	Mongodb.MostLeastEdited(1,function(err,result){
		if (err != 0){LeastEditedArticle = 'error'}
		else{
			LeastEditedArticle = result[0]['_id'];
			console.log(LeastEditedArticle)
			next();
		}		
	})
}
	
module.exports.LongestRrevisions = function(req,res,next){
	Mongodb.LongestHistory(function(err,result){
		if (err != 0){LongestHistoryArticle = 'error'}
		else{
			LongestHistoryArticle = result[0]['_id']+", "+result[1]['_id']+", "+result[2]['_id'];
			console.log(LongestHistoryArticle)
			next();
		}		
	})
}
	
	
module.exports.ShortestRrevisions = function(req,res,next){
	Mongodb.ShortestHistory(function(err,result){
		if (err != 0){ShortestHistoryArticle = 'error'}
		else{
			ShortestHistoryArticle = result[0]['_id'];//+", "+result[1]['_id']+", "+result[2]['_id'];
			console.log(ShortestHistoryArticle)
			next();
		}		
	})
}
	
	
module.exports.showPage=function(req,res){
	// res.render("entry.pug",{Top_T:TopThreeRrevisions,Bot_T:BottomThreeseRrevisions,
	// 	ME_A:MostEditedArticle,LE_A:LeastEditedArticle,
	// 	LH_A:LongestHistoryArticle,SH_A:ShortestHistoryArticle
	// 	})
	res.json({TOP:TopThreeRrevisions,BOT:BottomThreeseRrevisions,
		MOST:MostEditedArticle,LEAST:LeastEditedArticle,
		LONGEST:LongestHistoryArticle,SHORTEST:ShortestHistoryArticle
		})
}

module.exports.changePage = function(req,res){
	res.json({TOP:TopThreeRrevisions,BOT:BottomThreeseRrevisions})
}




