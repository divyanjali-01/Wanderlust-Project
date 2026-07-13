import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8"]);
import ejsMate from "ejs-mate";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import session from "express-session";
import MongoStore from "connect-mongo";

import flash from "connect-flash";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import ExpressError from "./utils/ExpressError.js";
import User from "./models/user.js";
import ListingRouter from "./routes/listing.js";
import ReviewRouter from "./routes/review.js";
import UserRouter from "./routes/user.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbUrl = process.env.ATLASDB_URL;

// Database Connection
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// App Settings & Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

//session store setup
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
      secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, 
});

store.on("error",()=>{
  console.log("Error in mongo session store",err);
});
// 1. Session Setup (Must be before Passport)
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};


app.use(session(sessionOptions));
app.use(flash());

// 2. Passport Setup (Requires active session)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Local Variables Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user || null;
  next();
});


// Application Routes
app.use("/listings", ListingRouter);
app.get("/", (req, res) => {
    res.redirect("/listings");
});
app.use("/listings/:id/reviews", ReviewRouter);
app.use("/", UserRouter);

// Central Error Handling Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  // console.log(err);
  res.status(statusCode).render("error.ejs", { message });
});

// Start Server
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
