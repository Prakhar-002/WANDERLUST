const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");
// const { deleteMany } = require("/Users/Yash Katiyar/MEGA PROJECT/models/listing.js");


// const mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbURL = process.env.ATLAS_DB_URL;


main()
      .then(() =>{
            console.log("connected to db");
      }).catch((err) =>{
            console.log(err);
      });

async function main(){
      await mongoose.connect(dbURL);
}

const initDb = async () =>{
      // await Listing.deleteMany({});
      initData.data = initData.data.map((obj) => ({...obj , owner : "6585d38cd7b6f0110ff89103"}))
      await Listing.insertMany(initData.data);
      console.log("Data is Inserted...");
}

initDb();
