var express = require("express");
var router = express.Router();
const passport = require("passport");

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
    successRedirect: "/",
    failureRedirect: "/",
  })
);

//OAuth logout router
router.get("/logout", function (req, res) {
  req.logout(function () {
    res.redirect("/");
  });
});

module.exports = router;
