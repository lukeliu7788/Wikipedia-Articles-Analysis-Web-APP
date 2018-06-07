var express = require('express')
var mongoose = require('mongoose')
var Revision = require('./revision_model');

// mongoose.connect('mongodb://localhost/wikiarticles' ,function(){
//     console.log('mongodb connected')
// });

module.exports.getAuthorRevision = function(author,callback){
    //var aa=new RegExp(author)
    var result =[
        {$match: {user: {$regex: new RegExp(author,"i")}}},
        {$group:{_id:{user:"$user",title:"$title"},total:{$sum:1},timestamp:{$push:"$timestamp"}}},
        //{$group: {_id: "$title", total:{$sum:1},timestamp:{$push:"$timestamp"}}},
        //{$group:}
        {$sort: {_id:1}}
    ]
    Revision.aggregate(result,function(err,results){
        if(err){
            console.log("Error with the aggregation")
            callback(1)
        }
        else{
            console.log(results)
            callback(0,results)
        }
    })
}

// module.exports.getTimestamps = function(author,title,callback){
//     var timestamps = [
//         {$match: {user: author, title: title}},
//         {$group: {_id: "$timestamp"}},
//         {$sort: {_id:-1}}
//     ]
//     Revision.aggregate(timestamps,function(err,results){
//         if(err){
//             console.log("Error with the aggregation")
//             callback(1)
//         }
//         else{
//             callback(0,results)
//         }
//     })
// }