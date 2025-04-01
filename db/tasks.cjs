const pool = require('./Pool.cjs');
require('dotenv').config();


const createTasks = async (owner, subject, description,
  project_id, priority, start_date, end_date, status,
  parent_task_id, sub_task_id) => {
  try {
    console.log("Creating task with data:", { owner, subject, description, project_id, priority, start_date, end_date, status, parent_task_id, sub_task_id });
    
    const { rows } = await pool.query(`
       INSERT INTO tasks (owner, subject, description, project_id, priority, start_date, end_date, status, parent_task_id, sub_task_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *;
    `, [owner, subject, description, project_id, priority, start_date, end_date, status, parent_task_id, sub_task_id])

    console.log('Task created:', rows);
    return rows[0];
  } catch (err) {
    console.log("Error creating task:", err);
  }
}


const getAllTasks = async () => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM tasks;
      `);
    return rows;
  } catch (err) {
    throw err
  }
}

const fetchAllTasksByProducts = async (project_id) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM tasks
      WHERE project_id = $1;
    `, [project_id]);

    if (!rows.length) {
      console.log(`No tasks found for project_id: ${project_id}`);
    }

    return rows;
  } catch (err) {
    console.log("Error fetching tasks by project:", err);
  }
}


const getMyTasks = async (username) => {
  try {
    const { rows: allTasksByOwner } = await pool.query(`
     SELECT * FROM tasks t
     JOIN users u ON t.owner = u.id
     WHERE username = $1
   `, [username]);

    return allTasksByOwner;

  } catch (err) {
    console.log(err);
  }
}


const getMyTasksPercentage = async (username) => {
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
      users u ON t.owner = u.id
  WHERE 
      u.username = $1
  GROUP BY 
      u.username;
  `, [username]);

    if (results.length === 0) {
      console.log(`No tasks found for user: ${username}`);
      return { in_progress_percentage: 0, paused_percentage: 0, completed_percentage: 0 }; // Default return
    }

    return results;
  } catch (err) {
    console.log("Error fetching task percentages:", err);
  }
}

const deleteExistingTask = async (taskId) => {
  try {
    const { rows: deletedTasks } = await pool.query(`
      DELETE FROM tasks 
      WHERE id = $1
      RETURNING *
      `, [taskId]);

    if (deletedTasks) {
      return deletedTasks;
    } else {
      throw Error({ message: `Task not found` });
    }
  } catch (err) {
    console.log(err);
  }
}


const updateExistingTask = async (taskId, updates) => {
  try {
    if (!Object.keys(updates).length) {
      throw new Error("No fields provided for update.");
    }

    let query = 'UPDATE tasks SET';
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(updates)) {
      query += ` ${key} = $${index},`;
      values.push(value);
      index++;
    }

    query = query.slice(0, -1);
    query += ` WHERE id = $${index} RETURNING *;`;
    values.push(taskId);

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      throw new Error("Task not found.");
    }

    return rows[0];
  } catch (err) {
    console.error("Error updating task:", err.message);
    throw err;
  }
};




module.exports = {
  createTasks, getAllTasks,
  fetchAllTasksByProducts, deleteExistingTask,
  updateExistingTask, getMyTasks,
  getMyTasksPercentage
}