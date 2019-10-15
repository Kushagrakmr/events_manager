var express = require("express");
var router  = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

router.get("/campgrounds",function(request, response){
    //Gat all campgrounds from the database
    Campground.find({}, function(error, allCampgrounds){
        if(error){
            console.log(error);
        } else {
            response.render("campgrounds/index",{campgrounds_app:allCampgrounds});
        }
    });
});    


//Create a new Campground
router.post("/campgrounds",middleware.isLoggedIn, function(request, response){
    //get data from form and add to the array
    var name    = request.body.name;
    var image   = request.body.image;
    var price   = request.body.price;
    var desc    = request.body.description;
    var author = {
        id: request.user._id,
        username : request.user.username
    }
    var newCampground = {name: name, image:image, price:price, description:desc, author:author};
    console.log(request.user);
    //Create a new campground and save it to the datbase
    Campground.create(newCampground, function(error, newlyCreated){
       if(error){
           console.log(error);
       } else {
           console.log(newlyCreated);
           response.redirect("/campgrounds");
       }
    });
});

router.get("/campgrounds/new",middleware.isLoggedIn, function(request, response) {
    response.render("campgrounds/new");
});


//SHOW ROUTE - shws more info about one campground
router.get("/campgrounds/:id", function(request, response) {
    
    //find the campgrounds with the ids
    Campground.findById(request.params.id).populate("comments").exec(function(error, foundCampgouound){
        if(error){
            console.log(error);
        } else{
            // render show template with that campground
            response.render("campgrounds/show", {campground: foundCampgouound});
            
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit",  middleware.checkCampgroundOwnership, function(request, response){
        Campground.findById(request.params.id, function(error, foundCampgouound){
            response.render("campgrounds/edit", {campground: foundCampgouound});
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, function(request , response){
    //find and update
    Campground.findByIdAndUpdate(request.params.id, request.body.campground, function(error, updatedCampground){
        if(error){
            response.redirect("/campgrounds");
        } else {
            response.redirect("/campgrounds/" + request.params.id);
        }
    })
});

//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership,function(request, response){
    Campground.findByIdAndRemove(request.params.id, function(error){
        if(error) {
            response.redirect("/campgrounds");
        } else {
            response.redirect("/campgrounds");
        }
    })
});

module.exports = router;