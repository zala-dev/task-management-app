const Project = require("../models/Project");

module.exports = {
  index,
  create,
  newProject,
  editProject,
  updateProject,
  deleteProject,
};

async function index(req, res) {
  const userId = req.user._id;
  const projects = await Project.find({ user: userId });
  if (!projects) return;

  res.render("projects/projectList", { title: "My Projects", projects });
}

async function create(req, res) {
  req.body.user = req.user.id.toString();
  for (let key in req.body) {
    if (req.body[key] === "") delete req.body[key];
  }

  const { name, description, color, user } = req.body;

  const newProject = {
    name,
    description,
    color,
    user,
  };

  try {
    await Project.create(newProject);
    console.log("Project created... Redirecting to dashbaord...");
    res.redirect("/projects");
  } catch (err) {
    console.log("Error creating project: ", err.message);
    res.render("projects/createProject", {
      title: "Add Project",
      errorMsg: err.message,
    });
  }
}

async function newProject(req, res) {
  res.render("projects/createProject", { title: "Add Project", errorMsg: "" });
}

async function deleteProject(req, res) {
  await Project.deleteOne({ _id: req.params.id });
  res.redirect("/projects");
}

async function editProject(req, res) {
  const project = await Project.findOne({ _id: req.params.id });
  res.render("projects/editProject", {
    project,
    title: "Edit Project",
  });
}

async function updateProject(req, res) {
  await Project.updateOne({ _id: req.params.id }, req.body);
  res.redirect("/projects");
}
