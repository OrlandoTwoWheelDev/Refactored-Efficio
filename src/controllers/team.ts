import { Request, Response } from "express";
import { getAllTeams, createTeamWithOwner, updateTeams, deleteTeams } from "../../db/teams.js";

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

export const createTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamname, username } = req.body;
console.log("DEBUGGING", req.body)
    if (!teamname || !username) {
      res.status(400).json({ error: 'Team name and username are required' });
      return;
    }

    const newTeam = await createTeamWithOwner(teamname, username);

    if (!newTeam) {
      res.status(500).json({ error: 'Failed to create team' });
      return;
    }

    res.status(201).json(newTeam);
  } catch (err) {
    console.error('Error in createTeam controller:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const updateTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamname, newteamname } = req.body;
    const updatedTeam = await updateTeams(teamname, newteamname);
    res.json(updatedTeam);
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ error: 'Server error while updating team.' });
  }
};

export const deleteTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamname } = req.body;
    const deletedTeam = await deleteTeams(teamname);
    res.json(deletedTeam);
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ error: 'Server error while deleting team.' });
  }
};
