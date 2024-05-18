const express = require("express");
const router = express.Router();

const projectCtrl = require("../controllers/projectController");
const ensuredLoggedIn = require("../config/ensureLoggedIn");

router.get("/", ensuredLoggedIn, projectCtrl.index);

router.get("/new", ensuredLoggedIn, projectCtrl.newProject);

router.post("/", ensuredLoggedIn, projectCtrl.create);

module.exports = router;
