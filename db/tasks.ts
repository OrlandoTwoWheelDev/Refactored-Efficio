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
      INSERT INTO tasks (title, description, username, project_id)
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

export const getTasksByUserId = async (userId: number): Promise<Task[]> => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM tasks
      WHERE user_id = $1
    `, [userId]);
    return rows;
  } catch (err) {
    console.error('Error getting tasks by user ID:', err);
    return [];
  }
};

export const getMyTasksPercentage = async (username: string) => {
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
        ) AS completed_percentage
      FROM 
        tasks t
      JOIN
        users u ON t.user_id = u.id  -- Adjusted here to use t.user_id
      WHERE 
        u.username = $1
      GROUP BY 
        u.username;
    `, [username]);

    return {
      username: results[0]?.username,
      inProgressPercentage: results[0]?.in_progress_percentage,
      pausedPercentage: results[0]?.paused_percentage,
      completedPercentage: results[0]?.completed_percentage,
    };

  } catch (err) {
    console.error('Error calculating task percentages:', err);
  }
};


export const updateTask = async (id: number, title: string, description: string): Promise<Task | undefined> => {
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

export const deleteTask = async (id: number): Promise<boolean> => {
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