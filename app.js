var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var SeedDB  = require('./seed')
var Comment = require('./models/comment');
var passport = require('passport');
var localStrategy = require('passport-local');
var User = require('./models/user');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require("express-session");

var MongoStore = require("connect-mongo")(session);

//REQUIRING ROUTES=============
var campgroundRoutes = require('./routes/campgrounds');
var commentRoutes = require('./routes/comments');
var indexRoutes = require('./routes/index');

// app.use(campgroundRoutes);
// app.use(commentRoutes);
// app.use(indexRoutes);

//================================

//DATABASEURL = mongodb://localhost/yelp_camp2

mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
//mongoose.connect("mongodb+srv://yash:yash0102@cluster0-yjv2p.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useCreateIndex: true });


 //SeedDB();

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIG
app.use(session({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore(
        { url: "mongodb+srv://yash:yash0102@cluster0-yjv2p.mongodb.net/test?retryWrites=true&w=majority" }),
    
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//========================================
//req.user - checking whether user is logged in or not (Middlewear)
//=========================================
// whatever we put inside res.locals that is what is available in our template
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


//The above snippet help us pass the currentUser object into every route using app.use() 
// Passport creates a req.user object if a user is looged in.
//if req.user = undefined then no user is logged in.

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT || 1511,function(){
    console.log("YelpCamp is live");
});

