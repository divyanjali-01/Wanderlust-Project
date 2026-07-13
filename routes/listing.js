import express from "express";
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import {isLoggedIn,isOwner,validateListing} from "../middleware.js";
import listingController from "../controllers/listings.js";
import multer from "multer";
import {storage} from "../cloudConfig.js";
const upload = multer({storage});


router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)//create route
    )
    

router.get("/new", isLoggedIn, listingController.renderNewForm);


router
.route("/:id")
.get(wrapAsync(listingController.showListing))//show route
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))//update route
.delete(
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.deleteListing));//delete route

//Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing));

export default router;