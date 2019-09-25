var express = require('express'); // Used to link the routes to the app.js
var router = express.Router();  // Used to link the routes to the app.js
var Comment = require('../models/comment');
var Campground = require('../models/campground');
var mongoose = require('mongoose');
var middleware = require('../middleware/index.js');

//Now we change all routes to router.method() from app.method


//===================== COMMENT ROUTES ========================

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    //find camground
    Campground.findById(req.params.id, function(err, newCampground){
        if(err){
            console.log(err);
        }else{
            
            res.render("comments/new", {campground: newCampground})
        }
    });
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else {
            console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, newComment){
                if(err){
                    req.flash("error", "Unable to create comment");
                    console.log(err);
                }else{

                    //add username and id to comment
                    newComment.author._id  = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    console.log("COMMENT CREATED");
                    campground.comments.push(newComment);
                    campground.save();
                    req.flash("success", "Comment added");
                    console.log("NEW COMMENT SAVED");
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
            
            
        }
    });
});

router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log("Comment not found");
            console.log(err);
        }else{
            res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
        }
    })
    
    
    
});

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log("comment not updated");
            console.log(err);
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log("comment not deleted");
            console.log(err);
        }else{
            req.flash("success", "comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
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

// function checkCommentOwnership(req, res, next){
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id, function(err, foundComment){
//             if(err){
//                 console.log(err);
//                 res.redirect("back");
//             }else{
//                 if(foundComment.author.id.equals(req.user._id)){
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