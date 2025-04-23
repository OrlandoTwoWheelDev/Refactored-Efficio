import pool from "./pool.js";

export type Task = {
  id: number;
  username: string;
  title: string;
  description: string;
  userId: number;
  projectId: number;
};

export const createTasks = async (title: string, description: string, username: string, projectId: number): Promise<Task | undefined> => {
  try {
    const { rows } = await pool.query(`
      INSERT INTO tasks (title, description, username, projectId)
      VALUES($1, $2, $3, $4)
      RETURNING *
    `, [title, description, username, projectId]);
    return rows[0];
  } catch (err) {
    console.error('Error creating task:', err);
    return undefined;
  }
};

export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM tasks
    `);
    return rows;
  } catch (err) {
    console.error('Error getting all tasks:', err);
    return [];
  }
};

export const getTasksByProjectId = async (projectId: number): Promise<Task[]> => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM tasks
      WHERE projectId = $1
    `, [projectId]);
    return rows;
  } catch (err) {
    console.error('Error getting tasks by project ID:', err);
    return [];
  }
};

export const getTasksByTeamId = async (teamId: number): Promise<Task[]> => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM tasks
      WHERE teamId = $1
    `, [teamId]);
    return rows;
  } catch (err) {
    console.error('Error getting tasks by team ID:', err);
    return [];
  }
};

export const getTasksByUserId = async (userId: number): Promise<Task[]> => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM tasks
      WHERE userId = $1
    `, [userId]);
    return rows;
  } catch (err) {
    console.error('Error getting tasks by user ID:', err);
    return [];
  }
};

export const getMyTasksPercentage = async (userId: number) => {
  try {
    const { rows: results } = await pool.query(`
      SELECT 
        u.username,
        ROUND(
          (COUNT(CASE WHEN t.status = 'in-progress' THEN 1 END) * 100.0) / COUNT(*),
          1
        ) AS in_progress_percentage,
        ROUND(
          (COUNT(CASE WHEN t.status = 'paused' THEN 1 END) * 100.0) / COUNT(*),
          1
        ) AS paused_percentage,
        ROUND(
          (COUNT(CASE WHEN t.status = 'completed' THEN 1 END) * 100.0) / COUNT(*),
          1
        ) AS completedPercentage
      FROM 
        tasks t
      JOIN
        users u ON t.userId = u.id  -- Adjusted here to use t.userId
      WHERE 
        u.username = $1
      GROUP BY 
        u.id;
    `, [userId]);

    return {
      userId: userId,
      inProgressPercentage: results[0]?.inProgressPercentage,
      pausedPercentage: results[0]?.pausedPercentage,
      completedPercentage: results[0]?.completedPercentage,
    };

  } catch (err) {
    console.error('Error calculating task percentages:', err);
  }
};


export const updateTasks = async (id: number, title: string, description: string): Promise<Task | undefined> => {
  try {
    const { rows } = await pool.query(`
      UPDATE tasks
      SET title = $1, description = $2
      WHERE id = $3
      RETURNING *
    `, [title, description, id]);
    return rows[0];
  } catch (err) {
    console.error('Error updating task:', err);
    return undefined;
  }
};

export const deleteTasks = async (id: number): Promise<boolean> => {
  try {
    await pool.query(`
      DELETE FROM tasks
      WHERE id = $1
    `, [id]);
    return true;
  } catch (err) {
    console.error('Error deleting task:', err);
    return false;
  }
};