const express = require('express');
const router = express.Router();

router.use('/projects', require('./projectsRoutes.cjs'));
router.use('/tasks', require('./tasksRoutes.cjs'));
router.use('/teams', require('./teamsRoutes.cjs'));
router.use('/users', require('./usersRoutes.cjs'));

module.exports = router;
