const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to the Home Page');
});

router.get('/login', (req, res) => {
  res.send('Welcome to the Login Page');
});

router.get('/dashboard', (req, res) => {
  res.send('Welcome to the Dashboard Page');
});

router.get('/teams', (req, res) => {
  res.send('Welcome to the Teams Page');
});

router.get('/projects', (req, res) => {
  res.send('Welcome to the Projects Page');
});

router.get('/tasks', (req, res) => {
  res.send('Welcome to the Projects Page');
});

router.get('/logout', (req, res) => {
  res.send('Welcome to the Logout Page');
});

module.exports = router;