import pool from './pool.js';
import pkg from 'validator';
const { isUUID } = pkg;

type Project = {
  id: number;
  project_name: string;
  description: string;
  status: string;
  start_date: Date;
  end_date: Date;
};

export const createProjects = async (
  project_name: string,
  description: string,
  status: string,
  start_date: Date,
  end_date: Date
): Promise<Project | undefined> => {
  try {
    const { rows } = await pool.query(`
      INSERT INTO projects (project_name, description, status, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
      [project_name, description, status, start_date, end_date]
    );
    return rows[0];
  } catch (error) {
    console.error('Project Error - createProjects:', error);
    return undefined;
  }
};

export const getProjectsByTeams = async (
  team_id: string
): Promise<Project[] | undefined> => {
  try {
    if (!isUUID(team_id)) {
      throw new Error(`Invalid UUID format: ${team_id}`);
    }

    const { rows } = await pool.query(`
      SELECT projects.* FROM projects
      JOIN projects_teams ON projects.id = projects_teams.project_id
      WHERE projects_teams.team_id = $1;
    `,
      [team_id]
    );

    return rows;
  } catch (error) {
    console.error('Project Error - getProjectsByTeams:', error);
    return undefined;
  }
};

export const getProjectsByUsers = async (
  user_id: string
): Promise<Project[] | undefined> => {
  try {
    if (!isUUID(user_id)) {
      throw new Error(`Invalid UUID format: ${user_id}`);
    }

    const { rows } = await pool.query(`
      SELECT projects.* FROM projects
      JOIN projects_teams ON projects.id = projects_teams.project_id
      JOIN teams_users ON projects_teams.team_id = teams_users.team_id
      WHERE teams_users.user_id = $1;
    `,
      [user_id]
    );

    return rows;
  } catch (error) {
    console.error('Project Error - getProjectsByUsers:', error);
    return undefined;
  }
};

export const getProjectsByUsername = async (
  username: string
): Promise<Project[] | undefined> => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT p.*
      FROM projects p
      JOIN projects_teams pt ON p.id = pt.project_id
      JOIN teams t ON pt.team_id = t.id
      JOIN teams_users tu ON t.id = tu.team_id
      JOIN users u ON tu.user_id = u.id
      WHERE u.username = $1;
    `,
      [username]
    );

    return rows;
  } catch (error) {
    console.error('Project Error - getProjectsByUsername:', error);
    return undefined;
  }
};

export const deleteExistingProject = async (
  project_id: string
): Promise<Project | undefined> => {
  try {
    if (!isUUID(project_id)) {
      throw new Error(`Invalid UUID format: ${project_id}`);
    }

    const { rows } = await pool.query(`
      DELETE FROM projects 
      WHERE id = $1
      RETURNING *;
    `,
      [project_id]
    );

    return rows[0];
  } catch (error) {
    console.error('Project Error - deleteExistingProject:', error);
    return undefined;
  }
};

export default Project;