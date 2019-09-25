var express = require('express'); // Used to link the routes to the app.js
var router = express.Router();  // Used to link the routes to the app.js
var Comment = require('../models/comment');
var Campground = require('../models/campground');
var User = require('../models/user');
var passport = require('passport');
var middleware = require('../middleware/index.js');
//Now we change all routes to router.method() from app.method


// AUTH ROUTES======================

router.get("/register", function(req,res){
    res.render("register");
});

router.post("/register",function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            console.log("Error registering");
            console.log(err);
            res.redirect("/register");
        }else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp" + user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

router.get("/login", function(req, res){
    res.render("login", {message: req.flash("error")});
});

router.post("/login", passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}), function(req,res){
    
});

router.get("/logout", function(req,res){
    req.logOut();
    req.flash("success", "Logged Out")
    res.redirect("/campgrounds");
});


// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }else{
//         res.redirect("/login");
//     }
// }

module.exports = router;