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
  console.log('Fetching dashboard data...');
  try {
    const userid = req.user?.id;
    if (!userid) {
      res.status(400).json({ error: 'User ID is missing or invalid.' });
      return;
    }

    const projects = await getProjectsByUsers(userid);
    console.log('Projects:', projects);
    const tasks = await getTasksByUserId(userid);
    console.log('Tasks:', tasks);

    const taskStatusCounts = await getMyTasksPercentage(userid);
    console.log('Task Status Counts:', taskStatusCounts);
    const projectStatusCounts = await getProjectsByPercentage(userid);
    console.log('Project Status Counts:', projectStatusCounts);

    const dashboardData = {
      userProjects: projects,
      userTasks: tasks,
      taskStatusCounts,
      projectStatusCounts,
    };
    console.log('Dashboard data:', dashboardData);
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Server error while fetching dashboard data.' });
  }
};
