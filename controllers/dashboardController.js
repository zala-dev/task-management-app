const Project = require("../models/Project");
const Task = require("../models/Task");

module.exports = {
  index,
};

async function index(req, res) {
  //   console.log("DASHCTRL USER: ", req.user);
  const messages = [];
  const todaysDate = new Date();

  const projects = await Project.find({});
  const tasks = await Task.find({});

  if (projects.length === 0) {
    messages.push("No Projects Found");
  }

  if (tasks.length === 0) {
    messages.push("No Tasks Today");
  }

  console.log("Tasks: ", tasks);

  // filter today's task
  todaysTasks = tasks.filter((task) => task.dueDate <= todaysDate);

  res.render("layouts/dashboard", {
    title: "Dashboard",
    projects,
    todaysTasks,
    errorMessage: messages,
  });
}
