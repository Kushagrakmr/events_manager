 var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User    = require("../models/user");
  
  
  
router.get("/",function(request, response){
    response.render("landing");
});


//======================
//AUTHENTICATION ROUTES
//======================


//show register form
router.get("/register",function(request, response) {
    response.render("register");
});

//handle signUp logic
router.post("/register", function(request, response) {
    var newUser = new User({username: request.body.username});
    User.register(newUser, request.body.password, function(error, user){
        if(error) {
            request.flash("error", error.message);
            return response.redirect("/register");
        }
        passport.authenticate("local")(request, response, function(){
            request.flash("error", "You need to be logged in to do that");
            request.flash("success", "Welcome to YelpCamp " + user.username);
            response.redirect("/campgrounds");
        });
    });
});


//show login form 
router.get("/login", function(request, response) {
    response.render("login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect : "/campgrounds",
        failureRedirect : "/login"
    }),function(request, response) {
});

//logout route
router.get("/logout", function(request, response) {
    request.logout();
    request.flash("success", "Logged You Out!")
    response.redirect("/campgrounds");
});

module.exports = router;