import { Request, Response } from "express";
import { getAllTasks, createTasks, updateTasks, deleteTasks, getTasksByProjectId, getTasksByTeamId } from "../../db/tasks.js";

export const getNewTaskPage = (req: Request, res: Response) => {
  res.send('Welcome to the new task page!');
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Server error while fetching tasks.' });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, status, projectid, startdate, enddate, userid } = req.body;
    const task = await createTasks(title, description, status, projectid, startdate, enddate, userid);
    if (!task) {
      res.status(400).json({ error: 'Failed to create task.' });
      return;
    }
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating task.' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    const task = await updateTasks(Number(req.params.id), title, description);
    if (!task) {
      res.status(400).json({ error: 'Failed to update task.' });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating task.' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await deleteTasks(Number(req.params.id));
    if (!task) {
      res.status(400).json({ error: 'Failed to delete task.' });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while deleting task.' });
  }
};

export const getTasksByProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await getTasksByProjectId(Number(req.params.id));
    if (!task) {
      res.status(400).json({ error: 'Failed to fetch tasks by project.' });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching tasks by project.' });
  }
};

export const getTasksByTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await getTasksByTeamId(Number(req.params.teamid));
    if (!tasks) {
      res.status(400).json({ error: 'Failed to fetch tasks by team.' });
      return;
    }
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching tasks by team.' });
  }
};