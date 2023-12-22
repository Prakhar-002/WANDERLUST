const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner , validateListing} = require("../MiddleWare.js");
const multer  = require('multer')

const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../CONTROLLERS/listingController.js");

// combine routes...
router.route("/")
      // index route...
      .get(wrapAsync(listingController.Index))
      //create route...
      .post(
            isLoggedIn, 
            upload.single("listing[image]"), 
            validateListing, 
            wrapAsync(listingController.newListingCreate)
      );


// new route...
router.get("/new" ,isLoggedIn, listingController.renderNewForm);

router.route("/:id")
      // update route...
      .put(isLoggedIn, 
            isOwner, 
            upload.single("listing[image]"), 
            validateListing, 
            wrapAsync( listingController.updateListing)
      )
      //delete route...
      .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))
      // show route...
      .get(wrapAsync(listingController.showListing));


// edit route...
router.get("/:id/edit" ,isLoggedIn, isOwner, wrapAsync( listingController.editListing));

module.exports = router; // router ko export kr di-ya...
