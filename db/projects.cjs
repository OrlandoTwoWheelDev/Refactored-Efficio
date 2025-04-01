const pool = require('./Pool.cjs');
const { v4: isUUID } = require('uuid');


const createProjects = async (project_name, status, start_date, end_date, description, user_id) => {
  const result = await pool.query(
    `INSERT INTO projects (project_name, description, status, start_date, end_date, user_id) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
    [project_name, status, start_date, end_date, description, user_id]
  );
  return result.rows[0]; // Return the created project
};


const getProjectsByTeams = async (team_id) => {
  try {
    if (!isUUID(team_id)) {
      throw new Error(`Invalid UUID format: ${team_id}`);
    }
    const { rows } = await pool.query(`
      SELECT projects.* FROM projects
      JOIN projects_teams ON projects.id = projects_teams.project_id
      WHERE projects_teams.team_id = $1;
    `, [team_id]);

    return rows;
  } catch (error) {
    console.error(`Get Project Error:`, error);
  }
}

const getProjectsByUserId = async (user_id) => {
  const { rows } = await pool.query(
      "SELECT * FROM projects WHERE user_id = $1",
      [user_id]
  );
  return rows;
};


const getProjectsByUsers = async (user_id) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM projects
      WHERE user_id = $1
    `, [user_id]);

    return rows;
  } catch (error) {
    console.error(`Get Project Error:`, error);
    throw error;
  }
};



const getProjectsByUsername = async (username) => {
  const result = await pool.query(
    `SELECT * FROM projects WHERE user_id IN (SELECT id FROM users WHERE username = $1);`,
    [username]
  );
  return result.rows;
};

const deleteExistingProject = async (project_id) => {
  try {
    const { rows: deletedProject } = await pool.query(`
      DELETE FROM projects 
      WHERE id = $1
      RETURNING *
      `, [project_id]);

    if (deletedProject) {
      return deletedProject;
    } else {
      throw Error({ message: `Task not found` });
    }
  } catch (err) {
    console.log(err);
  }
}

const updateExistingProject = async (projectId, updates) => {
  try {
    if (!Object.keys(updates).length) {
      throw new Error("No fields provided for update.");
    }
    let query = 'UPDATE projects SET';
    const values = [];
    let index = 1;
    for (const [key, value] of Object.entries(updates)) {
      query += ` ${key} = $${index},`;
      values.push(value);
      index++;
    }

    query = query.slice(0, -1);
    query += ` WHERE id = $${index} RETURNING *;`;
    values.push(projectId);

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      throw new Error("Project not found.");
    }

    return rows[0];
  } catch (err) {
    console.error("Error updating project:", err.message);
    throw err;
  }
};



module.exports = {
  createProjects,
  getProjectsByTeams,
  getProjectsByUsers,
  getProjectsByUsername,
  deleteExistingProject,
  updateExistingProject,
  getProjectsByUserId
};