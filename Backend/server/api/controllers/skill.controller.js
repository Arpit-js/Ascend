// /server/api/controllers/skill.controller.js
const pool = require('../../config/db');

// Get all skills
exports.getAllSkills = async (req, res) => {
  try {
    const allSkills = await pool.query('SELECT * FROM skills ORDER BY name ASC');
    res.json(allSkills.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};