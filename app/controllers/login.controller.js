var express = require('express');
var User = require('../models/user');

//show main page
module.exports.showIndex = function(req,res,next){
    res.render('landing.ejs', {match:1,checkUsername:1,checkEmail:1,reg:0});
}

//verify the register
module.exports.register = function(req,res,next){
    // verify the two password are the same
    if(req.body.password != req.body.passwordConf){
        res.json({passwordConf:"no"})
        // var err = new Error('Passwords don\'t match!');
        // err.status = 400;
        // res.send("passwords don\'t match!");
        // return next(err);
        //next();
    }
    else if(req.body.email && req.body.username && req.body.firstName 
        && req.body.lastName && req.body.password && req.body.passwordConf){
            var userData = {
                email: req.body.email,
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password,
                //passwordConf:req.body.passwordConf
            }
            console.log(userData.username)
            User.checkUsername(userData.username,function(err,user){
                console.log(user)
                if(user){
                    return res.render("landing.ejs",{checkUsername:0,match:1,checkEmail:1,reg:0})
                }
                else{
                    User.checkEmail(userData.email,function(err,result){
                        if(result){
                            return res.render("landing.ejs",{checkEmail:0,checkUsername:1,match:1,reg:0})
                        }
                        else{
                            User.create(userData, function(err,user){
                                if(err){
                                    return next(err);
                                }
                                else{
                                    //req.session.userId = user._id;
                                    res.render('landing.ejs', {match:1,checkUsername:1,checkEmail:1,reg:1});
                                }
                            });
                        }
                    })
                }
            })


            
    }
}


//verify login
module.exports.login = function(req,res,next){
    if(req.body.usernameLogin && req.body.passwordLogin){
        User.authenticate(req.body.usernameLogin,req.body.passwordLogin,
            function(error,user){
                if(error||!user){
                    //res.json({match:"no"})
                    req.session.userId = 0;
                    return res.render("landing.ejs",{match:0,checkUsername:1,checkEmail:1,reg:0})
                    //return res.redirect('/')
                    // var err = new Error('Invalid username or password.');
                    // err.status = 401;
                    //return next(err);
                }
                else{
                    req.session.userId = user._id;
                    return res.redirect('/main');
                }
        })
    }
}

module.exports.showMain = function(req,res,next){
    if (req.session.userId == 0){
        var err = new Error("Not authorized user! Cannot access to the page");
        err.status = 400;
        return next(err);
    }
    else{
        User.findById(req.session.userId)
        .exec(function(error,user){
            if(error){
                return next(error);
            }
            else{
                if(user == null){
                    var err = new Error("Not authorized user! Cannot access to the page");
                    err.status = 400;
                    //return next(err);
                    res.redirect('/')
                }
                else{
                    res.render("main.ejs");
                }
            }
        })
    }  
}

module.exports.logout = function(req,res,next){
    req.session.userId = 0;
    res.render("landing.ejs",{match:1,checkUsername:1,checkEmail:1,reg:0})
}

