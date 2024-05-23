const Project = require("../models/Project");

module.exports = {
  index,
  create,
  newProject,
  editProject,
  updateProject,
  deleteProject,
  toggleIsComplete,
};

async function index(req, res) {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const perPage = 3;

    const totalProjects = await Project.countDocuments({ user: userId });

    const totalPages = Math.ceil(totalProjects / perPage);

    const startIndex = (page - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, totalProjects);

    console.log("Page:", page);
    console.log("Total Projects:", totalProjects);
    console.log("Start Index:", startIndex);
    console.log("End Index:", endIndex);

    if (totalProjects === 0 || startIndex >= totalProjects) {
      return res.render("projects/projectList", {
        title: "My Projects",
        projects: [],
        currentPage: page,
        totalPages,
        startIndex: 0,
        endIndex: 0,
      });
    }

    const projects = await Project.find({ user: userId })
      .skip(startIndex)
      .limit(perPage);

    console.log("Fetched Projects:", projects);

    res.render("projects/projectList", {
      title: "My Projects",
      projects,
      currentPage: page,
      totalPages,
      startIndex,
      endIndex,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data: " + err.message);
  }
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
  console.log("UPDATED PROJECT: ", req.body);
  res.redirect("/projects");
}

async function toggleIsComplete(req, res) {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    project.isComplete = !project.isComplete;

    await project.save();

    res.redirect("/projects");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
