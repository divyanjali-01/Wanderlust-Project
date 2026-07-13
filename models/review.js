
import mongoose, { set } from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema=  new Schema({
    review: {
        type: String,
    },
    rating:{
        type:Number,
        min:1,
        max:5

    },
    createAt:{
        type:Date,
        default:Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

});
export const Review = mongoose.model("Review",reviewSchema);
export default Review;