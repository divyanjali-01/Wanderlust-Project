import mongoose, { set } from "mongoose";
const Schema = mongoose.Schema;
import Review from "./review.js";

const listingSchema = new Schema({
    title: {
    type: String,
    required: true
    },
    description: String,

    image: {
        filename:String,
        url:String     
    },
    price: Number,
    location: String,
    country: String,
    category: {
  type: String,
  enum: [
    "Trending",
    "Rooms",
    "Iconic Cities",
    "Mountains",
    "Castles",
    "Amazing Pools",
    "Camping",
    "Farms",
    "Arctic",
    "Domes",
    "Boats"
  ],
  default: "Trending"
},
    
    reviews: [
    {
        type: mongoose.Schema.Types.ObjectId,
      ref: "Review", // Must match your Review model name exactly
    },
    ],
    owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    },
    
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});
const Listing = mongoose.model("Listing", listingSchema);

export default Listing;