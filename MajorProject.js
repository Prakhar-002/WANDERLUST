if (process.env.NODE_ENV != "production") {
      require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRoute = require("./routes/listingRoutes.js");
const reviewRoute = require("./routes/reviewsRoutes.js");
const userRoute = require("./routes/userRoutes.js");

// const mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbURL = process.env.ATLAS_DB_URL;

app.set("views", path.join(__dirname ,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs" ,ejsMate);
app.use(express.static(path.join(__dirname ,"public")));

const store = MongoStore.create({
      mongoUrl : dbURL,
      crypto : {
            secret : process.env.SECRET,
      },
      touchAfter : 24 * 60 * 60 , // in seconds...
});

store.on("error" , () =>{
      console.log("ERROR in MONGO SESSION STORE" , err);
});

const sessionOptions = {
      store,
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized : true,
      cookie :{
            expires : Date.now() + 7 * 24 * 60 * 60 *1000,
            maxAge :  7 * 24 * 60 * 60 *1000,
            httpInly : true
      }
}


// session 
app.use(session(sessionOptions));
app.use(flash());

// for passwords...
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      res.locals.curUser = req.user;
      // console.log(res.locals.success);
      next();
});


main()
      .then(() =>{
            console.log("connected to db");
      }).catch((err) =>{
            console.log(err);
      });

app.get("/" , (req , res) =>{
      // res.send("Hi ! I'm root");
      res.redirect("/listings");
});

async function main(){
      // await mongoose.connect(mongo_URL);
      await mongoose.connect(dbURL);
}

//---------------------------------------------------------------------------------
// local data store
// app.get("/demoUser" , async(req, res)=>{
//       let fakeUser = new User({
//             email : "fakeUser@gmail.com",
//             username : "Joe"
//       });

//       let registeredUser = await User.register(fakeUser , "helloWorld");
//       res.send(registeredUser);
// });

app.use("/listings" , listingRoute);
app.use("/listings/:id/reviews" , reviewRoute);
app.use("/" , userRoute);

//-----------------------------------------------------------------------------------------
// if page of belonging not found
app.all("*" , (req , res , next) =>{
      next(new ExpressError (404 , "Page Not Found!"));
});

//-----------------------------------------------------------------------------------------
app.use((err,req, res , next) =>{
      // res.send("something went wrong...");
      let {statusCode =500 , message ="Something Went Wrong"} = err;
      // res.status(statusCode).send(message);
      res.render("listings/error.ejs" ,{err});
})

//-----------------------------------------------------------------------------------------

app.listen(8080 ,()=>{
      console.log("server is listening...");
});
