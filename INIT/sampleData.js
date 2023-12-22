const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");
// const { deleteMany } = require("/Users/Yash Katiyar/MEGA PROJECT/models/listing.js");


const mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
      .then(() =>{
            console.log("connected to db");
      }).catch((err) =>{
            console.log(err);
      });

async function main(){
      await mongoose.connect(mongo_URL);
}

const initDb = async () =>{
      await Listing.deleteMany({});
      initData.data = initData.data.map((obj) => ({...obj , owner : "65819d18ee0881b66a089dff"}))
      await Listing.insertMany(initData.data);
      console.log("Data is Inserted...");
}

initDb();
