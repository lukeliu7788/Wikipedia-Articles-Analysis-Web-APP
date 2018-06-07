var express = require('express')
var Mongodb = require('../models/individual_model')
var usertypedb = require('../models/overall_model')
var fs = require('fs')

var admintxtpath = './public/admin.txt';
var bottxtpath ='./public/bot.txt';
var admin_array=fs.readFileSync(admintxtpath,'utf8').split("\n");
var bot_array=fs.readFileSync(bottxtpath,'utf8').split("\n");

var number
var top5 = new Array()
var Anon = new Array()
var admin = new Array()
var bot = new Array()
var user = new Array()
var names = new Array()


module.exports.update=function(req, res){
    var title = req.query.title;
    console.log("req title:"+ title)
    var data = new Array()
    Mongodb.articleLatestRevision(title, function(err, result){
        //data["latestRevision"] = result[0]["_doc"]
        // console.log(result)
        data["latestRevision"] = result[0].timestamp
        console.log("latest:"+result[0].timestamp)
        //console.log(new Date())
        //console.log(new Date() - Date.parse(result[0].timestamp))
        if((new Date() - Date.parse(result[0].timestamp)) < 86400000){
            data["update"] = 0
            console.log("data1:")
            console.log(result)
            var length=0
            res.json({data:length})
            
        }
        else {
            // var revisionData = mediaWiki.updateRevisions(article, data["latestRevision"])
            Mongodb.updateRevisions(title, data["latestRevision"], result[0].timestamp, function(err,revisionData){
                console.log("updated revision: ")
                //console.log(revisionData)
                var length
                if(revisionData){
                    length=revisionData.length
                    Mongodb.add_usertype(title,bot_array,'bot');
                    Mongodb.add_usertype(title,admin_array,'admin');
                    Mongodb.Updateanon(title);
                }                
                else{
                    length=0
                }
                res.json({data:length})
            })
        }
    })
}

module.exports.getTitle = function(req,res){
    Mongodb.getTitle(function(err,result){
        if (err != 0){console.log('error')}
        else{
            names = names.concat(result)
            //console.log("names sucess")
            //res.render("page.pug", {names:names})
            res.json({names:names})
        }
    })
}

module.exports.getTotal = function(req,res,next){
    title = req.query.title
    Mongodb.getTotalNumber(title,function(err,result){
        if (err != 0){res.json({'count':'error'})}
        else{
            number = result
            //console.log('Total')
            next()
        }
    })
}

module.exports.getTop5 = function(req,res,next){
    title = req.query.title
    Mongodb.getTop5(title,function(err,result){
        if (err != 0){console.log('error')}
        else{
            top5.splice(0,top5.length)
            for (var i in result){
                top5.push(result[i]['_id'])
            }
            //console.log('Top5')
            next()
        }
    })
}

module.exports.getAnon = function(req,res,next){
    title = req.query.title
    Mongodb.getArticleAnonNumber(title,function(err,result){
        if (err != 0){console.log('error')}
        else{
            Anon.splice(0,Anon.length);
            for (var i = 2001; i < 2019 ; i++){
                Anon.push({_id:i.toString(),numOfEdits:0})
            }
            for (var i in result){
                for (var j = 2001; j < 2019 ; j++){
                    if (result[i]['_id'] == j.toString())
                        Anon[j-2001]['numOfEdits'] += result[i]['numOfEdits']
                }
            }
            //console.log('Anon')
            next()
        }
    })
}

module.exports.getBot = function(req,res,next){
    title = req.query.title
    Mongodb.getArticleBotNumber(title,function(err,result){
        if (err != 0){console.log('error')}
        else{
            bot.splice(0,bot.length);
            for (var i = 2001; i < 2019 ; i++){
                bot.push({_id:i.toString(),numOfEdits:0})
            }
            for (var i in result){
                for (var j = 2001; j < 2019 ; j++){
                    if (result[i]['_id'] == j.toString())
                        bot[j-2001]['numOfEdits'] += result[i]['numOfEdits']
                }
            }
            //console.log('Bot')
            next()
        }
    })
}

module.exports.getAdmin = function(req,res,next){
    title = req.query.title
    Mongodb.getArticleAdminNumber(title,function(err,result){
        if (err != 0){console.log('error')}
        else{
            admin.splice(0,admin.length);
            for (var i = 2001; i < 2019 ; i++){
                admin.push({_id:i.toString(),numOfEdits:0})
            }
            for (var i in result){
                for (var j = 2001; j < 2019 ; j++){
                    if (result[i]['_id'] == j.toString())
                        admin[j-2001]['numOfEdits'] += result[i]['numOfEdits']
                }
            }
            //console.log('Admin')
            next()
        }
    })
}

module.exports.getUser = function(req,res){
    title = req.query.title
    Mongodb.getArticleUserNumber(title,function(err,result){
        if (err != 0){console.log('error')}
        else{
            user.splice(0,user.length);
            for (var i = 2001; i < 2019 ; i++){
                user.push({_id:i.toString(),numOfEdits:0})
            }
            for (var i in result){
                for (var j = 2001; j < 2019 ; j++){
                    if (result[i]['_id'] == j.toString())
                        user[j-2001]['numOfEdits'] += result[i]['numOfEdits']
                }
            }

            //convert data to google char format
            var chart = new Array()
            chart.push(['Year','Administrator','Anonymous','Bot','Regular user'])
            for (var year = 2001 ; year < 2019 ; year ++){
                chart.push([year.toString(),admin[year-2001]['numOfEdits'],Anon[year-2001]['numOfEdits'],bot[year-2001]['numOfEdits'],user[year-2001]['numOfEdits']])
            }
            //console.log('User')
            res.json({Title:title,TotalNumber:number,top5:top5,result:chart})
        }
    })
}

module.exports.getTop5Data = function(req,res){
    title = req.query.title
    users = req.query.users
//	console.log(title)
    Mongodb.getIndividualTop5(title,users,function(err,result){
        if (err != 0){console.log('error')}
        else{
            //convert data to google char format
            var chartData = new Array()
            var tmp = ['Year'].concat(users)
            chartData.push(tmp)

            for (var i = 2001; i < 2019 ; i++){
                var P = [i]
                for (var j = 0; j < users.length ; j++){
                    P.push(0)
                }
                chartData.push(P)
            }
//			console.log(result)
            for (var i in result){
                for (var j in chartData[0]){
                    if(result[i]['_id']['user'] == chartData[0][j]){
                        year = parseInt(result[i]['_id']['year'])
                        chartData[year-2001][j] += result[i]['numOfEdits']
                    }
                }
            }

            for (var i = 2001; i < 2019 ; i++){
                chartData[i-2001][0] = chartData[i-2001][0].toString()
            }
//			console.log(chartData)

            res.json({result:chartData})
        }
    })
}