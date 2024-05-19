const Task = require("../models/Task");
const Project = require("../models/Project");

module.exports = {
  index,
  create,
  newTask,
};

async function index(req, res) {
  const tasks = await Task.find({});
  if (!tasks) return;
  res.render("tasks/taskList", { title: "My Tasks", tasks });
}

async function create(req, res) {
  req.body.user = req.user.id.toString();
  const project = await Project.findOne({ name: req.body.project });

  let projectId = null;

  if (project) {
    projectId = project._id;
  }

  const { title, description, dueDate, user } = req.body;

  const newTask = {
    title,
    description,
    dueDate,
    project: projectId,
    user,
  };

  try {
    await Task.create(newTask);
    project.tasks.push({ title, description, dueDate });
    await project.save();
    console.log("Task created... Redirecting to dashbaord...");
    res.redirect("/tasks");
  } catch (err) {
    console.log("Error creating project: ", err.message);
    res.render("tasks/createTask", {
      title: "Add Task",
      errorMsg: err.message,
    });
  }
}

async function newTask(req, res) {
  const userId = req.user._id;
  const allProjects = await Project.find({ user: userId });
  const projectNames = allProjects.map((project) => project.name);
  console.log("Project List: ", projectNames);

  res.render("tasks/createTask", {
    title: "Add Task",
    projects: projectNames,
    errorMsg: "",
  });
}
