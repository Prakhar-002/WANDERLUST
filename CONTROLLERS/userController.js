const User = require("../models/user.js");

//------------------------------------------------------------------------------------------
// signup...

module.exports.signupPage = (req, res) =>{
      res.render("users/signupForm.ejs");
};

module.exports.newSignup = async(req , res)=>{
      try {
            let {username , email , password} = req.body;
            const newUser = new User({username , email});
            const registeredUser = await User.register(newUser , password);
            // for automatic log in with signup user...
            req.login(registeredUser , (err)=>{
                  if (err) {
                        return next(err);
                  }
                  req.flash("success" ,"Welcome to WonderLust!");
                  res.redirect("/listings");
            });
      } catch (error) {
            req.flash("error" , error.message);
            res.redirect("/signup");
      }
};

//----------------------------------------------------------------------------------------
// Login...

module.exports.loginPage =  (req, res)=>{
      res.render("users/loginForm.ejs");
};

module.exports.successLogin = async(req, res) =>{
      req.flash("success","Welcome back to WonderLust ! ");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
};

//----------------------------------------------------------------------------------------
// Logout...

module.exports.logout =  (req , res, next) =>{
      req.logOut((err)=>{
            if (err) {
                  return next(err);
            }
            req.flash("success" , "Logged out successfully");
            res.redirect("/listings");
      })
};
