import { Request, Response } from "express";
import { getAllTeams, createTeams, updateTeams, deleteTeams, createTeamsUser } from "../../db/teams.js"; // Adjust the import based on your actual file structure

export const getTeamPage = (req: Request, res: Response) => {
  res.send('Welcome to the Team page!')
};

export const getTeams = async (req: Request, res: Response) => {
  try {
    const teams = await getAllTeams();
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Server error while fetching teams.' });
  }
};

export const createTeam = async (req: Request, res: Response) => {
  try {
    const { teamname } = req.body;
    const newTeam = await createTeams(teamname);
    res.status(201).json(newTeam);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Server error while creating team.' });
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  try {
    const { teamname, newteamname } = req.body;
    const updatedTeam = await updateTeams(teamname, newteamname);
    res.json(updatedTeam);
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ error: 'Server error while updating team.' });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const { teamname } = req.body;
    const deletedTeam = await deleteTeams(teamname);
    res.json(deletedTeam);
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ error: 'Server error while deleting team.' });
  }
};

export const assignUserToTeam = async (req: Request, res: Response) => {
  try {
    const { teamname, username } = req.body;
    const result = await createTeamsUser(teamname, username);
    res.json(result);
  } catch (error) {
    console.error('Error assigning user to team:', error);
    res.status(500).json({ error: 'Server error while assigning user to team.' });
  }
};

