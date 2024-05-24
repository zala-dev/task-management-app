module.exports = {
  index,
};

function index(req, res) {
  res.render("calendar/index", { title: "Google Calendar" });
}
