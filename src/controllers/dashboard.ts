import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

import { getProjectsByUsers } from '../../db/projects.js';
import { getTasksByUserId } from '../../db/tasks.js';
import { getMyTasksPercentage } from '../../db/tasks.js';
import { getProjectsByPercentage } from '../../db/projects.js';

export const getDashboardPage = (req: Request, res: Response) => {
  res.send('Welcome to the dashboard page!');
};

export const getDashboardInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ error: 'User ID is missing or invalid.' });
      return;
    }

    const projects = await getProjectsByUsers(userId);
    const tasks = await getTasksByUserId(userId);

    const taskStatusCounts = await getMyTasksPercentage(userId);
    const projectStatusCounts = await getProjectsByPercentage(userId);

    const dashboardData = {
      userProjects: projects,
      userTasks: tasks,
      taskStatusCounts,
      projectStatusCounts,
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Server error while fetching dashboard data.' });
  }
};
