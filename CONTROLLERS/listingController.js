const Listing = require("../models/listing");


//-----------------------------------------------------------------------------------------
// index route...

module.exports.Index = async (req , res) =>{
      const allListings=await Listing.find({});
      res.render("listings/allListings.ejs" ,{allListings});
};

//-----------------------------------------------------------------------------------------
// new route

module.exports.renderNewForm = (req,res) =>{
      res.render("listings/newListing.ejs");
};

//-----------------------------------------------------------------------------------------
// update route

module.exports.updateListing = async (req, res) =>{
      let {id} = req.params;
      let listing = await Listing.findByIdAndUpdate(id ,{...req.body.listing});
      if (typeof ( req.file ) !== "undefined") {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url , filename};
            await listing.save();
      }
      req.flash("success" , "Listing Updated !");
      res.redirect(`/listings/${id}`);
};

//-----------------------------------------------------------------------------------------
//delete route

module.exports.destroyListing = async(req,res) =>{
      let {id} = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      req.flash("error" , "Listing Deleted !");
      res.redirect("/listings");
};

//-----------------------------------------------------------------------------------------
// edit route

module.exports.editListing = async (req , res)=>{
      let {id} = req.params;
      const listing = await Listing.findById(id);
      if (!listing) {
            req.flash("error" , "Listing is not exist !!!");
            res.redirect("/listings");
      }

      let originalImageUrl = listing.image.url ; 
      originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250");
      res.render("listings/edit.ejs" , {listing , originalImageUrl});
};

//-----------------------------------------------------------------------------------------
// show route

module.exports.showListing =  async (req , res) =>{
      let {id} = req.params;
      const listing = await Listing.findById(id).populate({path :"reviews" , populate :{ path:"author"}}).populate("owner");
      if (!listing) {
            req.flash("error" , "Listing is not exist !!!");
            res.redirect("/listings");
      }
      res.render("listings/show.ejs" ,{listing});
};

//-----------------------------------------------------------------------------------------
// new data save and redirect ---- //create route...

module.exports.newListingCreate = async (req,res) =>{
      let url = req.file.path;
      let filename = req.file.filename;
      const  newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id ;
      newListing.image = { url , filename};
      await newListing.save();
      req.flash("success" , "woohoo!!!  New listing created !");
      res.redirect("/listings");
};