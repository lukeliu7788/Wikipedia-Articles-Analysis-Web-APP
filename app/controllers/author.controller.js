var express = require('express')
var mongodb = require("../models/author_model")

var article
var timestamps

// module.exports.showMain = function(req,res){
// 	res.render('author.ejs')
// }

module.exports.getArticles = function(req,res){
    author = req.query.user
    mongodb.getAuthorRevision(author,function(err,result){
        if(err){
            
        }
        else{
            console.log(result)
            res.json({articles:result})
        }
    })
}

// module.exports.getTimestamps = function(req,res){
//     author = req.query.user
//     title = req.query.title
//     mongodb.getTimestamps(author,title,function(err,result){
//         if(err){}
//         else{
//             console.log(result)
//             res.json({timestamps:result})
//         }
//     })
// }
