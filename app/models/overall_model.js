var express = require('express')
var mongoose = require('mongoose')
var request = require('request')
var Revision = require('./revision_model');

// mongoose.connect('mongodb://localhost/wikiarticles',function () {
// 	  console.log('mongodb connected')
// });



////update bot_admin
//module.exports.add_usertype = function (array,usertype){
//	Revision.update({user:{"$in":array}},{$set:{"usertype":usertype}},{'multi':true},function(err){
//		if(err){console.log('change_error')}
//		else{
//			console.log('change success')
//		}
//	});
//}

//update admin and bot user
module.exports.add_usertype = function (array,usertype){
	Revision.update({user:{"$in":array}},{$set:{"usertype":usertype}},{'multi':true},function(err){
		if(err){console.log('change_error')}
		else{
			console.log('change success')
		}
	});
}

//update anon user
module.exports.Updateanon = function (){
	console.log('change anon begin');
	Revision.update({anon:{"$exists":true}},{$set:{"usertype":"anon"}},{'multi':true},function(err){
		if(err){console.log('change_error')}
		else{
			console.log('change success')
		}
	});
}


module.exports.NRrevisions = function(number,order,callback){
	var NRrevisionsPipeline = [
		{'$group':{_id:"$title", numOfEdits: {$sum:1}}},
		{'$sort':{numOfEdits:order}},
		{'$limit':number}	
	];	
	
	Revision.aggregate(NRrevisionsPipeline, function(err, results){
		if (err){
			console.log("Aggregation Error123")
		}else{
			callback(0,results)
		}
	});
}


module.exports.MostLeastEdited = function(order,callback){
	var MostLeastEditedPipeline = [
		{'$match':{usertype:{$exists: false}}},
		{'$group':{_id:"$title",userGroup:{'$addToSet':"$user"}}},
		{'$project':{userCount:{$size:'$userGroup'}}},
		{'$sort':{userCount:order}},
		{'$limit':1}
		];
	
	Revision.aggregate(MostLeastEditedPipeline, function(err, results){
		if (err){
			console.log("Aggregation Error")
		}else{
			callback(0,results)
		}
	});
}


module.exports.LongestHistory = function(callback){
	var LongestEditedPipeline = [
		{'$group':{_id:"$title", createtime:{$min: "$timestamp"}}},
		{'$sort':{createtime:1}},
		{'$limit':3}
		];
	
	Revision.aggregate(LongestEditedPipeline, function(err, results){
		if (err){
			console.log("Aggregation Error")
		}else{
			callback(0,results)
		}
	});
}

module.exports.ShortestHistory = function(callback){
	var ShortestEditedPipeline = [
		{'$group':{_id:"$title", createtime:{$min: "$timestamp"}}},
		{'$sort':{createtime:-1}},
		{'$limit':1}
		];
	
	Revision.aggregate(ShortestEditedPipeline, function(err, results){
		if (err){
			console.log("Aggregation Error")
		}else{
			callback(0,results)
		}
	});
}

module.exports.YearUsertypeAna = function(callback){
	var YearUsertypeAnaPipeline = [
		{'$project':{year:{$substr:["$timestamp", 0, 4]},usertype:1}}, 
		{'$group':{_id:{year:"$year",usertype:"$usertype"},number:{$sum:1}}}
		];
	
	Revision.aggregate(YearUsertypeAnaPipeline, function(err, results){
		if (err){
			console.log("Aggregation Error")
		}else{
			console.log(results)
			callback(0,results)
		}
	});
}







