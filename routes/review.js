import express from "express";
const router = express.Router({mergeParams: true});

import ExpressError from "../utils/ExpressError.js";
import wrapAsync from "../utils/wrapAsync.js";
import Review from "../models/review.js";

import Listing from "../models/listing.js";
import {validateReview,isLoggedIn} from "../middleware.js";
import { isReviewAuthor } from '../middleware.js';
import * as reviewController from "../controllers/review.js";

 



//reviews
//post route
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync( reviewController.postReview));


//review delete route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync( reviewController.deleteReview)
);



export default router;
