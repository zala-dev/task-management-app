module.exports = function (req, res, next) {
  console.log("Is Authenticated: ", req.isAuthenticated());
  if (req.isAuthenticated()) return next();

  res.redirect("/");
};
