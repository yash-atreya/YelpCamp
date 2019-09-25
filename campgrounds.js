var express = require('express'); // Used to link the routes to the app.js
var router = express.Router();  // Used to link the routes to the app.js
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var mongoose = require('mongoose');
var middleware = require('../middleware/index.js');
// var middleware = require('../middleware') can also type this as by deault express searches for index.js
//Now we change all routes to router.method() from app.method

router.get("/", function(req,res){
    res.render("landing");
});

// INDEX ROUTE
router.get("/campgrounds", function(req,res){
    console.log(req.user);
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        }else{
            console.log(allCampgrounds);
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
            
        }
    });
    
});
//CREATE ROUTE
// https://image.shutterstock.com/image-photo/camp-forest-adventure-travel-remote-260nw-443840548.jpg
router.post("/campgrounds", middleware.isLoggedIn, function(req,res){
    
    var name = req.body.name;
    var image = req.body.image;
    var dsc = req.body.description;
    
    var author = {
            id: req.user._id,
            username: req.user.username
    };

    var newCampground = {name: name, image: image, description: dsc, author: author};
    // Create new campground in database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else {
            
            console.log("campground added");
            console.log(newCampground);
            res.redirect("/campgrounds");
        }
    })
    // campgrounds.push(newCampground);
    
});



//NEW ROUTE
router.get("/campgrounds/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
})

//SHOW ROUTE
router.get("/campgrounds/:id", function(req, res){
    //find the campground with the provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            //render show template
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    
});

// EDIT ROUTE

router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground})
    })    
});

router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
    var data = {
        name:req.body.name,
        price: req.body.price,
        image:req.body.image,
        description: req.body.description
    };
    Campground.findByIdAndUpdate(req.params.id, data, function(err, updatedCampground){
            if(err){
                console.log("Error updating campground");
                console.log(err);
            }else{
                res.redirect("/campgrounds/" + req.params.id);
            }
    });

});

//Destroy Route 

router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("Deleting error");
            console.log(err);
        }else{
            console.log("Deleted");
            res.redirect("/campgrounds");
        }
    });
});

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }else{
//         res.redirect("/login");
//     }
// }

// function checkCampgroundOwnership(req, res, next){
//     if(req.isAuthenticated()){
//         Campground.findById(req.params.id, function(err, foundCampground){
//             if(err){
//                 console.log(err);
//                 res.redirect("back");
//             }else{
//                 if(foundCampground.author.id.equals(req.user._id)){
//                     next();
//                 }else{
//                     console.log("You dont have permission");
//                     res.redirect("back"); // Sends user to the previous page
//                 }
//             }
//         });
//     }else{
//         console.log("You need to login");
//         res.redirect("/login");
//     }
// }


module.exports = router;
