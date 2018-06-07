var mongoose = require('mongoose')

var revSchema = new mongoose.Schema(
    {	
        revid:Number,
        parentid:Number,
        sha1: String,
        title: String, 
        timestamp:String,
        parsedcomment:String,
        user:String,
        anon:String,
        size:Number,
        usertype:String,
        minor:String
        },
    {
        versionKey: false 
    });

var Revision = mongoose.model('Revision', revSchema,'revisions');

module.exports = Revision;