const express = require("express");
const router = express.Router();

const taskCtrl = require("../controllers/taskController");
const ensuredLoggedIn = require("../config/ensureLoggedIn");

router.get("/", ensuredLoggedIn, taskCtrl.index);

router.get("/new", ensuredLoggedIn, taskCtrl.newTask);

router.post("/", ensuredLoggedIn, taskCtrl.create);

router.delete("/:id", ensuredLoggedIn, taskCtrl.deleteTask);

router.get("/:id/edit", ensuredLoggedIn, taskCtrl.editTask);

router.put("/:id", ensuredLoggedIn, taskCtrl.updateTask);

router.post("/:id/toggle", taskCtrl.toggleIsComplete);

module.exports = router;
