const express = require('express');
const router = express.Router();

const { fetchAllTeamNames, createTeams,
  assignUserToTeams, deleteExistingTeams,
  retrieveTeamsByUsername } = require('../db/teams.cjs');


router.get('/', async (req, res, next) => {
  try {
    const teams = await fetchAllTeamNames();
    res.send(teams);
  } catch (err) {
    next(err);
  }
});

router.get('/associtedTeams/:username', async (req, res, next) => {
  const { username } = req.params;

  try {
    const associatedTeamNames = await retrieveTeamsByUsername(username);
    res.send(associatedTeamNames);
  } catch (err) {
    next(err);
  }
});

router.post('/create-new-team', async (req, res, next) => {

  try {
    const { team_name } = req.body;

    if (!team_name) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newTeam = await createTeams(team_name);

    res.status(201).json({ message: "Team has been created successfullt!!!", newTeam });

  } catch (err) {
    next(err);
  }
});

router.post('/assignUsersToTeams', async (req, res, next) => {
  try {
    const { team_name, username } = req.body;

    if (!team_name || !username) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const assignNewTeamMember = await assignUserToTeams(team_name, username);

    res.status(201).json({ message: "User has been assigned to a team successfullt!!!" });

  } catch (err) {
    next(err);
  }
});

router.delete('/delete-team/:team_name', async (req, res, next) => {
  const { team_name } = req.params;

  console.log("Deleting Team:", team_name);
  try {

    const deletedTeam = await deleteExistingTeams(team_name);

    if (!deletedTeam) {
      return res.status(404).json({ error: "Team not found!" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;