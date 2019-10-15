var express = require("express");
var router  = express.Router();
var Campground = require("../models/campgrounds");
var Comment    = require("../models/comment");
var middleware = require("../middleware");
//=========================
//COMMENT ROUTES
//=========================

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(request, response) {
    //find campground by id
    Campground.findById(request.params.id, function(error, campground){
      if (error) {
          console.log(error);
      } else {
          response.render("comments/new",{campground : campground});
      } 
    });
});

//comment create
router.post("/campgrounds/:id/comments",middleware.isLoggedIn   ,function(request , response){
   //lookup the campgrounds using ID
   Campground.findById(request.params.id, function(error, campground) {
       if (error){
           console.log(error);
           response.redirect("/campground");
       } else {
           Comment.create(request.body.comment, function(error, comment){
             if(error){
                 request.flash("error", "Something went wrong");
                 console.log(error);
             } else {
                 comment.author.id = request.user._id;
                 comment.author.username = request.user.username;
                 comment.save();
                 campground.comments.push(comment);
                 campground.save();
                 request.flash("success", "Successfully added comment");
                 response.redirect("/campgrounds/" + campground._id);
             } 
           });
       }
   });

});

//COMMENT EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership, function(request, response){
    Comment.findById(request.params.comment_id, function(error, foundComment){
        if(error){
            response.redirect("back");
        } else {
            response.render("comments/edit", {campground_id: request.params.id, comment: foundComment});
        }
    })
});

//COMMENT UPDATE ROUTE
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(request, response){
   Comment.findByIdAndUpdate(request.params.comment_id, request.body.comment, function(error, updatedComment){
       if(error){
           response.redirect("back");
       } else {
           response.redirect("/campgrounds/" + request.params.id);
       }
   });
});

//COMMENT DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(request, response){
    Comment.findByIdAndRemove(request.params.comment_id, function(error){
        if(error){
            response.redirect("back");
        } else {
            request.flash("success", "Successfully deleted comment");
            response.redirect("/campgrounds/"+ request.params.id);
        }
    })
});

module.exports = router;