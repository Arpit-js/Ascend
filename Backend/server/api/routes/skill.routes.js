// /server/api/routes/skill.routes.js
const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skill.controller');

// GET /api/skills/
router.get('/', skillController.getAllSkills);

module.exports = router;