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

// function to retrieve and render projects for the logged-in user
async function index(req, res) {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const perPage = 3;

    const totalProjects = await Project.countDocuments({ user: userId });

    const totalPages = Math.ceil(totalProjects / perPage);

    const startIndex = (page - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, totalProjects);

    // Render empty project list if no projects found
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

    // Fetch projects for the current page
    const projects = await Project.find({ user: userId })
      .skip(startIndex)
      .limit(perPage);

    // Render project list
    res.render("projects/projectList", {
      title: "My Projects",
      projects,
      currentPage: page,
      totalPages,
      startIndex,
      endIndex,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

// function to create a new project
async function create(req, res) {
  // conver user ID to string
  req.body.user = req.user.id.toString();
  // remove empty fields from request body
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
    // Create new project
    await Project.create(newProject);
    res.redirect("/projects");
  } catch (err) {
    res.render("projects/createProject", {
      title: "Add Project",
      errorMsg: err.message,
    });
  }
}

// funnction to render the form for adding a new project
async function newProject(req, res) {
  // Render new project form
  res.render("projects/createProject", { title: "Add Project", errorMsg: "" });
}

// function to delete a project
async function deleteProject(req, res) {
  // Delete project by ID
  await Project.deleteOne({ _id: req.params.id });
  res.redirect("/projects");
}

// function to render the form for editing a project
async function editProject(req, res) {
  // Find project by ID and render edit form
  const project = await Project.findOne({ _id: req.params.id });
  res.render("projects/editProject", {
    project,
    title: "Edit Project",
  });
}

// function to update the project details
async function updateProject(req, res) {
  // Update project details
  await Project.updateOne({ _id: req.params.id }, req.body);
  res.redirect("/projects");
}

// function to toggle project completion status
async function toggleIsComplete(req, res) {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    // Check if project exists
    if (!project) {
      return res.status(404).send("Project not found");
    }

    // Toggle completion status
    project.isComplete = !project.isComplete;

    // Save changes
    await project.save();

    res.redirect("/projects");
  } catch (err) {
    res.status(500).send(err.message);
  }
}
