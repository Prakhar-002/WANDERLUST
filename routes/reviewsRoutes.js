const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , validateReview , isReviewAuthor } = require("../MiddleWare.js");

const reviewController = require("../CONTROLLERS/reviewController.js");

// review --> post route
router.post("/" ,isLoggedIn, validateReview , wrapAsync(reviewController.createReview));

// delete review route...
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
