const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
      title: {
            type: String,
            required: true,
      },
      description: String,
      image: {
            // type: String,
            // default:"https://images.unsplash.com/photo-1473654729523-203e25dfda10?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            // set: (v) => 
            // v === "" 
            //       ? "https://images.unsplash.com/photo-1473654729523-203e25dfda10?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            //       : v,
            url : String,
            filename : String,
      },
      price: {
            type: Number,
            min: 1,
      },
      location: {
            type: String,
      },
      country: {
            type: String,
      },
      reviews :[ {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review",
      }],
      owner : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
      },
});

listingSchema.post("findOneAndDelete" , async(listing) =>{
      if(listing){
            await Review.deleteMany({ _id : {$in : listing.reviews}});
      }
});

// const Listing = mongoose.model("Listing", listingSchema);
const Listing = mongoose.model("Listing" , listingSchema);
// console.log("hlw");
module.exports = Listing;
