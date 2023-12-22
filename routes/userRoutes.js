const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../MiddleWare.js");

const userController = require("../CONTROLLERS/userController.js");

//----------------------------------------------------------------------------------------
// signup...

router.route("/signup")
      // page render
      .get( userController.signupPage )
      // save data
      .post(wrapAsync(userController.newSignup));

//----------------------------------------------------------------------------------------
// Login...
router.route("/login")
      // get details
      .get(userController.loginPage)
      // find and log in user
      .post(
      saveRedirectUrl,
      passport.authenticate("local" ,{
            failureRedirect: "/login",
            failureFlash : true,
      }),
      userController.successLogin
);

//----------------------------------------------------------------------------------------
// Logout...

router.get("/logout" ,userController.logout)

module.exports = router;