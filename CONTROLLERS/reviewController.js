const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//-----------------------------------------------------------------------------------------
// review --> post route

module.exports.createReview = async(req,res) =>{
      let listing = await Listing.findById(req.params.id);
      let newReview = new Review(req.body.review);
      newReview.author = req.user._id;
      listing.reviews.push(newReview);

      await newReview.save();
      await listing.save();

      // console.log("new review saved...");
      // res.send("review saved...");

      req.flash("success" , "woohoo!!!  New Review created !");
      res.redirect(`/listings/${listing.id}`);
};

//-----------------------------------------------------------------------------------------
// delete review route...

module.exports.destroyReview = async ( req , res ) =>{
      let{id , reviewId} = req.params;

      await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
      // ^^^ it will delete the id of deleted review...
      let deletedReview= await Review.findByIdAndDelete(reviewId);

      req.flash("error" , "Review Deleted !");
      res.redirect(`/listings/${id}`);
};