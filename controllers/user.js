import User from "../models/user.js";

export const getSignup = (req,res)=>{
    res.render("users/signup.ejs")
};

export const postSignup = async (req,res)=>{
try{
    let {username,email,password} = req.body;
    const newUser = new User({email, username});
    const registeredUser=await User.register(newUser,password);
// console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};
export const loginUser = (req,res)=>{
    res.render("users/login.ejs")
};

export const postLogin = async (req,res)=>{
    req.flash("success","Welcome back! you are logged in");
    res.redirect(res.locals.redirectUrl || "/listings");
};

export const logoutUser = async (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next();
            // req.flash("error","Error occurred while logging out");
            // return res.redirect("/listings");
        }
        req.flash("success","You have been logged out");
        res.redirect("/listings");
    });
};

export default {getSignup,postSignup,loginUser,postLogin,logoutUser};