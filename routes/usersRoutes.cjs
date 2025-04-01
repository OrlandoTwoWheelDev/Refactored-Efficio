const pool = require('../db/Pool.cjs')
const express = require('express');
const router = express.Router();

const{createUsers, authenticateUser, 
  fetchUsersByTeamName, fetchMyAccountInfo, 
getAllUsers } = require('../db/users.cjs');

router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    throw err;
  }
});

router.get('/usersByTeam/:team_name', async(req, res, next) => {
  const {team_name} = req.params;

  try{
    const usersByTeamNames = await fetchUsersByTeamName(team_name);
    res.send(usersByTeamNames);
  } catch(err) {
    next(err);
  }
});

router.get('/myaccountinfo/:username', async (req, res, next) => {
  const { username } = req.params;

  try {
    const myAccountInfo = await fetchMyAccountInfo(username);
    console.log("fetchMyAccountInfo result:", myAccountInfo);

    res.json(myAccountInfo);
  } catch (error) {
    console.error("Error fetching account info:", error);
    next(error);
  }
});


router.post('/register', async(req, res, next) => {
  try{
   const {first_name, last_name, password, username, email} = req.body;
  const createdUser = await createUsers(first_name, last_name, password, username, email);
    if(createdUser) {
      res.status(201).json({message: "User created successfully!"});
    }
  } catch (err) {
   next(err)
   res.send(err.message);
  }
 });
 
 router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const token = await authenticateUser(username, password);
    console.log("Generated Token:", token); // Check if the token is generated
    if (token) {
      res.json({ token });
    } else {
      res.status(401).json({ message: "Authentication failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports  = router;