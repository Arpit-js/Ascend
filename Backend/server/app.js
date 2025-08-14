// /server/app.js

// Capture the result of the config() function in a new variable
const dotenvResult = require('dotenv').config();

// Now you can log that variable
console.log('Dotenv config result:', dotenvResult);

const express = require('express');
const cors = require('cors');
const authRoutes = require('./api/routes/auth.routes');
const skillRoutes = require('./api/routes/skill.routes'); // 1. Import

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes); // 2. Add this line

app.get('/', (req, res) => {
  res.send('Pathfinder API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});