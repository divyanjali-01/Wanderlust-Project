import express from "express";
const router = express.Router();

import ExpressError from "../utils/ExpressError.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import userController from "../controllers/user.js";

import User from "../models/user.js";

router.route("/signup")
.get(userController.getSignup)
.post(wrapAsync(userController.postSignup));


router.route("/login")
    .get(userController.loginUser)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        wrapAsync(userController.postLogin)
    );

    
//get logout route
router.get("/logout",wrapAsync(async (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next();
            // req.flash("error","Error occurred while logging out");
            // return res.redirect("/listings");
        }
        req.flash("success","You have been logged out");
        res.redirect("/listings");
    });
}));


export default router