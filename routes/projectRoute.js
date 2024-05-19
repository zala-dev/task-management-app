const express = require("express");
const router = express.Router();

const projectCtrl = require("../controllers/projectController");
const ensuredLoggedIn = require("../config/ensureLoggedIn");

router.get("/", ensuredLoggedIn, projectCtrl.index);

router.get("/new", ensuredLoggedIn, projectCtrl.newProject);

router.post("/", ensuredLoggedIn, projectCtrl.create);

router.delete("/:id", ensuredLoggedIn, projectCtrl.deleteProject);

router.get("/:id/edit", projectCtrl.editProject);

router.put("/:id", projectCtrl.updateProject);

module.exports = router;
