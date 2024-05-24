var express = require("express");
var router = express.Router();

const passport = require("passport");
const dashboardCtrl = require("../controllers/dashboardController");
const calendarCtrl = require("../controllers/calendarController");
const ensuredLoggedIn = require("../config/ensureLoggedIn");
router.get("/", function (req, res, next) {
  res.render("auth/login.ejs", { title: "Task Tracker" });
});

// Google OAuth login route
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google OAuth callback route
router.get(
  "/oauth2callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/google",
    failureFlash: true,
  })
);

//OAuth logout router
router.get("/logout", function (req, res) {
  req.logout(function () {
    res.redirect("/");
  });
});

// Get dashboard page
router.get("/dashboard", ensuredLoggedIn, dashboardCtrl.index);

// Get calendar page
router.get("/calendar", ensuredLoggedIn, calendarCtrl.index);

module.exports = router;
