const Task = require("../models/Task");
const Project = require("../models/Project");

module.exports = {
  index,
  create,
  newTask,
  deleteTask,
  editTask,
  updateTask,
  toggleIsComplete,
};

// function to retrieve and render tasks for the logged-in user
async function index(req, res) {
  try {
    // Retrieve the logged-in user's ID
    const userId = req.user._id;
    // Find tasks associated with the user and populate the project field
    const tasks = await Task.find({ user: userId }).populate("project");

    // If no tasks found, return
    if (!tasks) return;

    // Render the task list page with retrieved tasks
    res.render("tasks/taskList", { title: "My Tasks", tasks });
  } catch (err) {
    // Handle any errors that occur during the process
    res.status(500).send(err.message);
  }
}

// function to create a new task
async function create(req, res) {
  try {
    // Set the user ID for the new task
    req.body.user = req.user.id.toString();
    // Find the project associated with the task
    const project = await Project.findOne({ name: req.body.project });

    let projectId = null;

    // If project exists, set its ID
    if (project) {
      projectId = project._id;
    }

    const { title, description, dueDate, user } = req.body;

    // Create a new task object with provided details
    const newTask = {
      title,
      description,
      dueDate,
      project: projectId,
      user,
    };

    // Save the new task
    await Task.create(newTask);

    // If project exists, add the task to its tasks array and save
    if (project) {
      project.tasks.push({ title, description, dueDate });
      await project.save();
    }

    // Redirect to tasks page after creating the task
    res.redirect("/tasks");
  } catch (err) {
    // Handle any errors that occur during the creation process
    res.render("tasks/createTask", {
      title: "Add Task",
      errorMsg: err.message,
    });
  }
}

// funnction to render the form for adding a new task
async function newTask(req, res) {
  try {
    // Retrieve the logged-in user's ID
    const userId = req.user._id;
    // Find all projects associated with the logged-in user
    const allProjects = await Project.find({ user: userId });
    // Extract project names from the found projects
    const projectNames = allProjects.map((project) => project.name);

    // Render the create task form with available projects
    res.render("tasks/createTask", {
      title: "Add Task",
      projects: projectNames,
      errorMsg: "",
    });
  } catch (err) {
    // Handle any errors that occur during the rendering process
    res.status(500).send(err.message);
  }
}

// function to delete a task
async function deleteTask(req, res) {
  try {
    // Find current task ID
    const task = await Task.findById(req.params.id);

    console.log("Delete Task Current Properties: ", task);

    // If task is not found, return a 404 response
    if (!task) {
      return res.status(404).send("Task not found");
    }

    // If the task has associated project, update the project's task array
    if (task.project) {
      const project = await Project.findById(task.project);

      if (project) {
        // delete the task from the project's tasks array
        project.tasks = project.tasks.filter(
          (projectTask) =>
            projectTask.title.toString() !== task.title.toString()
        );

        // save the updated project
        await project.save();
      }
    }
    // Delete the task based on the provided ID
    await Task.deleteOne({ _id: req.params.id });

    // Redirect to the tasks page after deletion
    res.redirect("/tasks");
  } catch (err) {
    // Handle any errors that occur during the deletion process
    res.status(500).send(err.message);
  }
}

// function to render the form for editing a task
async function editTask(req, res) {
  try {
    // Retrieve the logged-in user's ID
    const userId = req.user.id;
    // Find the task to be edited and populate its associated project
    const task = await Task.findOne({ _id: req.params.id }).populate("project");
    // Find all projects associated with the logged-in user
    const projects = await Project.find({ user: userId });

    // Formatte the date from the task's dueDate
    const formattedDueDate = task.dueDate.toISOString().split("T")[0];

    // Render the edit task form with task details and available projects
    res.render("tasks/editTask", {
      task,
      projects,
      formattedDueDate,
      title: "Edit Task",
    });
  } catch (err) {
    // Handle any errors that occur during the process
    res.status(500).send(err.message);
  }
}

// function to update the task details
async function updateTask(req, res) {
  try {
    const taskId = req.params.id;
    const newProjectId = req.body.project;

    // convert date to mongoose compatible format
    req.body.dueDate = new Date(req.body.dueDate);

    // Fetch the task by ID
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send("Task not found");
    }

    // Fetch the new project by ID
    const newProject = await Project.findById(newProjectId);

    if (!newProject) {
      return res.status(404).send("New project not found");
    }

    // If the task is being moved to a different project, update the old project's tasks array
    let oldProject = null;
    if (task.project && task.project.toString() !== newProjectId) {
      oldProject = await Project.findById(task.project);
      if (oldProject) {
        // Remove the task from the old project's tasks array
        oldProject.tasks = oldProject.tasks.filter(
          (task) => task && task._id && task._id.toString() !== taskId
        );
        await oldProject.save();
      }
    }

    // Update the task with new data
    task.set(req.body);
    task.project = newProjectId; // Ensure the project field is updated
    await task.save();

    // Add the task to the new project's tasks array if it's not already there
    if (
      !newProject.tasks.some(
        (task) => task && task._id && task._id.toString() === taskId
      )
    ) {
      newProject.tasks.push(task);
    }

    // Save the new project
    await newProject.save();

    res.redirect("/tasks");
  } catch (err) {
    res.status(500).send(err.message);
  }
}

// function to toggle task completion status
async function toggleIsComplete(req, res) {
  try {
    // Get task ID from request params
    const taskId = req.params.id;
    // Find task by ID
    const task = await Task.findById(taskId);

    // Return 404 if task doesn't exist
    if (!task) {
      return res.status(404).send("Task not found");
    }

    // Toggle task completion status
    task.isComplete = !task.isComplete;

    // Save updated task
    await task.save();

    // Redirect to tasks page
    res.redirect("/tasks");
  } catch (err) {
    // Handle internal server error
    res.status(500).send(err.message);
  }
}
