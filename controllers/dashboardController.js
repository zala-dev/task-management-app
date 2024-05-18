const Project = require("../models/Project");
const Task = require("../models/Task");

module.exports = {
  index,
};

async function index(req, res) {
  const messages = [];
  const todaysDate = new Date();

  const userId = req.user._id;

  const projects = await Project.find({ user: userId });
  const tasks = await Task.find({ user: userId });

  if (projects.length === 0) {
    messages.push("No Projects Found");
  }

  if (tasks.length === 0) {
    messages.push("No Tasks Today");
  }

  // filter today's task
  todaysTasks = tasks.filter((task) => task.dueDate <= todaysDate);

  res.render("layouts/dashboard", {
    title: "Dashboard",
    projects,
    todaysTasks,
    errorMessage: messages,
  });
}
