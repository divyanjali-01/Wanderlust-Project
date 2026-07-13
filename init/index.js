import mongoose from "mongoose";
import initData from "./data.js";
import Listing from "../models/listing.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
    console.log("connected to DB");
    })
    .catch((err) => {
    console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "6a44a4f95210e065115f37a3" }));
    const result = await Listing.insertMany(initData.data);

console.log("Inserted count:", result.length);
console.log("Collection:", Listing.collection.name);
console.log("DB:", mongoose.connection.name);
    
    // await Listing.insertMany(initData.data);
    // console.log("data was initialized");
};


initDB();