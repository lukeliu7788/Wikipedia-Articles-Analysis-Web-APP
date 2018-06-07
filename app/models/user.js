var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    username:{
        type:String,
        required:true,
        unique: true,
        trim: true
    },
    password:{
        type:String,
        required:true
    }
});

//authentication of the login input
UserSchema.statics.authenticate = function(username,password,callback){
    User.findOne({username:username})
        .exec(function(err,user){
            if(err){
                return callback(err)
            }
            else if (!user){
                var err = new Error('Incorrect username.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password,user.password,function(err, result){
                if(result == true){
                    return callback(null,user);
                }
                else{
                    return callback();
                }
            })
        });
}

UserSchema.statics.checkUsername = function(username,callback){
    User.findOne({username: username}).exec(function(err,user){
        if(err){
            return callback(err)
        }
        else if(!user){
            return callback(err)
        }
        else{
            return callback(null,user)
        }
    })
}

UserSchema.statics.checkEmail = function(email,callback){
    User.findOne({email: email}).exec(function(err,email){
        if(err){
            return callback(err)
        }
        else if(!email){
            return callback(err)
        }
        else{
            return callback(null,email)
        }
    })
}
//hashing the password for security
UserSchema.pre('save',function(next){
    var user=this;
    bcrypt.hash(user.password,10,function(err,hash){
        if(err){
            return next(err);
        }
        user.password = hash;
        next();
    })
});

var User = mongoose.model('User',UserSchema);
module.exports = User;
