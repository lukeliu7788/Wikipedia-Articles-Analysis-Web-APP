var express = require('express')
var mongoose = require('mongoose')
var request = require('request')
var Revision = require('./revision_model');

// mongoose.connect('mongodb://localhost/wikiarticles', function () {
//     console.log('mongodb connected')
// });

module.exports.add_usertype = function (title,array,usertype){
	Revision.update({user:{"$in":array},title:title},{$set:{"usertype":usertype}},{'multi':true},function(err){
		if(err){console.log('change_error')}
		else{
			console.log('change success')
		}
	});
}

module.exports.Updateanon = function (title){
	console.log('change anon begin');
	Revision.update({anon:{"$exists":true},title:title},{$set:{"usertype":"anon"}},{'multi':true},function(err){
		if(err){console.log('change_error')}
		else{
			console.log('change success')
		}
	});
}
//update database
module.exports.updateRevisions = function (title, start, time, callback) {
    var https = require('https')
    var wikiEndpointHost = "en.wikipedia.org",
        path = "/w/api.php"
    parameters = ["action=query",
        "format=json",
        "prop=revisions",
        "titles=" + encodeURIComponent(title),
        "rvstart=" + start,
        "rvdir=newer",
        "rvlimit=max",
        "rvprop=ids|flags|user|timestamp|size|sha1|parsedcomment"],

        headers = {
            Accept: 'application/json',
            'Accept-Charset': 'utf-8'
        }

    //var response = {}

    var full_path = path + "?" + parameters.join("&")
    var options = {
        host: wikiEndpointHost,
        path: full_path,
        headers: headers
    }

    var httpReq = https.get(options, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk
        })
        res.on('end', function () {
            json = JSON.parse(data);
            pages = json.query.pages
            revisions = pages[Object.keys(pages)[0]].revisions
            revisions.splice(0, 1)

            for (var revision in revisions) {
                revisions[revision]["title"] = title
                //console.log(revisions[revision])
            }
            console.log("There are " + revisions.length + " revisions.");
            if (revisions[0] != undefined) {
                Revision.insertMany(revisions, function (err, results) {
                    if (err) {
                        console.log("insert Error")
                        callback(1)
                    } else {
                        callback(0, results)
                    }
                })
            }
            else {
                console.log('No new revisions!')
                callback(0)
            }
        })
    })
    httpReq.on('error', function (e) {
        console.log(e)
    })
    httpReq.end();
    
}

module.exports.articleLatestRevision = function (title, callback) {

    var latest = [
        { '$match': { title: title } },
        { '$sort': { timestamp: -1 } }, 
        { $limit: 1 }
    ]
    Revision.aggregate(latest, function (err, results) {
        if (err) {
            console.log("Aggregation Error")
            callback(1)
        } else {
            callback(0, results)
        }
    })
}

module.exports.getTitle = function (callback) {
    Revision.distinct('title')
        .exec(function (err, result) {
            if (err) {
                console.log("Query error!");
                callback(1)
            }
            else {
                //console.log("success")
                callback(0, result)
            }
        })
}


module.exports.getTotalNumber = function (title, callback) {
    Revision.find({ 'title': title })
        .count()
        .exec(function (err, result) {
            if (err) {
                console.log("Query error!")
                callback(1)
            } else {
                callback(0, result)
            }
        })
}



module.exports.getTop5 = function (title, callback) {
    var top5 = [
        { '$match': { $and: [{ anon: { $ne: "" } }, { 'usertype': { '$exists': false } }, { title: title }] } },
        { $group: { _id: "$user", numOfEdits: { $sum: 1 } } },
        { $sort: { numOfEdits: -1 } },
        { $limit: 5 }
    ]
    Revision.aggregate(top5, function (err, results) {
        if (err) {
            console.log("Aggregation Error")
            callback(1)
        } else {
            //console.log("get top5 success")
            callback(0, results)
        }
    })
}

module.exports.getIndividualTop5 = function (title, users, callback) {
    var yearlytop5 = [
        { '$match': { title: title, user: { "$in": users } } },
        { '$group': { _id: { year: { "$substr": ["$timestamp", 0, 4] }, user: '$user' }, 'numOfEdits': { $sum: 1 } } },
        { '$sort': { _id: 1 } }
    ]
    Revision.aggregate(yearlytop5, function (err, results) {
        if (err) {
            console.log("Aggregation Error")
            callback(1)
        } else {
            callback(0, results)
        }
    })

}

module.exports.getArticleAnonNumber = function (title, callback) {
    var anon = [
        { '$match': { anon: "", title: title } },
        { '$group': { '_id': { "$substr": ["$timestamp", 0, 4] }, 'numOfEdits': { $sum: 1 } } },
        { '$sort': { _id: 1 } }
    ]
    Revision.aggregate(anon, function (err, results) {
        if (err) {
            console.log("Aggregation Error")
            callback(1)
        } else {
            callback(0, results)
        }
    })
}

module.exports.getArticleBotNumber = function (title, callback) {
    var bot = [
        { '$match': { usertype: "bot", title: title } },
        { '$group': { '_id': { "$substr": ["$timestamp", 0, 4] }, 'numOfEdits': { $sum: 1 } } },
        { '$sort': { _id: 1 } }
    ]
    Revision.aggregate(bot, function (err, results) {
        if (err) {
            console.log("Aggregation Error")
            callback(1)
        } else {
            callback(0, results)
        }
    })
}

module.exports.getArticleAdminNumber = function (title, callback) {
    var admin = [
        { '$match': { usertype: "admin", title: title } },
        { '$group': { '_id': { "$substr": ["$timestamp", 0, 4] }, 'numOfEdits': { $sum: 1 } } },
        { '$sort': { _id: 1 } }
    ]
    Revision.aggregate(admin, function (err, results) {
        if (err) {
            console.log("Aggregation Error")
            callback(1)
        } else {
            callback(0, results)
        }
    })
}

module.exports.getArticleUserNumber = function (title, callback) {
    var user = [
        { '$match': { $and: [{ anon: { $ne: "" } }, { 'usertype': { '$exists': false } }, { title: title }] } },
        { '$group': { '_id': { "$substr": ["$timestamp", 0, 4] }, 'numOfEdits': { $sum: 1 } } },
        { '$sort': { _id: 1 } }
    ]
    Revision.aggregate(user, function (err, results) {
        if (err) {
            console.log("Aggregation Error")
            callback(1)
        } else {
            callback(0, results)
        }
    })
}
