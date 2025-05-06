import pool from "./pool.js";

export type Task = {
  id: number;
  status: string;
  title: string;
  description: string;
  projectid: number;
  startdate: Date;
  enddate: Date;
  userid: number;
};

export const createTasks = async (title: string, description: string, status: string, projectid: number, startdate: Date, enddate: Date, userid: number): Promise<Task | undefined> => {
  try {
    const { rows } = await pool.query(`
      INSERT INTO tasks (title, description, status, projectid, startdate, enddate, userid)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [title, description, status, projectid, startdate, enddate, userid]);
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

export const getTasksByProjectId = async (projectid: number): Promise<Task[]> => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM tasks
      WHERE projectid = $1
    `, [projectid]);
    return rows;
  } catch (err) {
    console.error('Error getting tasks by project ID:', err);
    return [];
  }
};

export const getTasksByTeamId = async (teamid: number): Promise<Task[]> => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM tasks
      WHERE teamid = $1
    `, [teamid]);
    return rows;
  } catch (err) {
    console.error('Error getting tasks by team ID:', err);
    return [];
  }
};

export const getTasksByUserId = async (userid: number): Promise<Task[]> => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM tasks
      WHERE userid = $1
    `, [userid]);
    return rows;
  } catch (err) {
    console.error('Error getting tasks by user ID:', err);
    return [];
  }
};

export const getMyTasksPercentage = async (userid: number) => {
  try {
    const { rows: results } = await pool.query(`
      SELECT 
        u.username,
        ROUND(
          (COUNT(CASE WHEN t.status = 'active' THEN 1 END) * 100.0) / COUNT(*),
          1
        ) AS activepercentage,
        ROUND(
          (COUNT(CASE WHEN t.status = 'pending' THEN 1 END) * 100.0) / COUNT(*),
          1
        ) AS pendingpercentage,
        ROUND(
          (COUNT(CASE WHEN t.status = 'completed' THEN 1 END) * 100.0) / COUNT(*),
          1
        ) AS completedpercentage
      FROM 
        tasks t
      JOIN
        users u ON t.userid = u.id  -- Adjusted here to use t.userid
      WHERE 
        u.username = $1
      GROUP BY 
        u.id;
    `, [userid]);

    return {
      userid: userid,
      activepercentage: results[0]?.activepercentage,
      pendingpercentage: results[0]?.pendingpercentage,
      completedpercentage: results[0]?.completedpercentage,
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