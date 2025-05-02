import pool from './pool.js';
import pkg from 'validator';
const { isUUID } = pkg;

type Project = {
  id: number;
  projectname: string;
  projectdescription: string;
  status: string;
  startdate: Date;
  enddate: Date;
};

export const createProjects = async (
  projectname: string,
  projectdescription: string,
  status: string,
  startdate: Date,
  enddate: Date
): Promise<Project> => {
  try {
    const { rows } = await pool.query(`
      INSERT INTO projects (projectname, projectdescription, status, startdate, enddate)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
      [projectname, projectdescription, status, startdate, enddate]
    );
    return rows[0];
  } catch (error) {
    console.error('Project Error - createProjects:', error);
    throw new Error('Failed to create project');
  }
};

export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM projects;
    `);
    return rows;
  } catch (error) {
    console.error('Project Error - getAllProjects:', error);
    return [];
  }
};

export const getProjectsByTeams = async (
  teamId: string
): Promise<Project[] | undefined> => {
  try {
    if (!isUUID(teamId)) {
      throw new Error(`Invalid UUID format: ${teamId}`);
    }

    const { rows } = await pool.query(`
      SELECT projects.* FROM projects
      JOIN projectsTeams ON projects.id = projectsTeams.projectId
      WHERE projectsTeams.teamId = $1;
    `,
      [teamId]
    );

    return rows;
  } catch (error) {
    console.error('Project Error - getProjectsByTeams:', error);
    return undefined;
  }
};

export const getProjectsByUsers = async (
  userId: number
): Promise<Project[] | undefined> => {
  try {
    if (!isUUID(userId.toString())) {
      throw new Error(`Invalid UUID format: ${userId}`);
    }

    const { rows } = await pool.query(`
      SELECT projects.* FROM projects
      JOIN projectsTeams ON projects.id = projectsTeams.projectId
      JOIN teamsUsers ON projectsTeams.teamId = teamsUsers.teamId
      WHERE teamsUsers.userId = $1;
    `,
      [userId]
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
      JOIN projectsTeams pt ON p.id = pt.projectId
      JOIN teams t ON pt.teamId = t.id
      JOIN teamsUsers tu ON t.id = tu.teamId
      JOIN users u ON tu.userId = u.id
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

export const getProjectsByPercentage = async(
  userId: number
): Promise<Project[] | undefined> => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT p.*
      FROM projects p
      JOIN projectsTeams pt ON p.id = pt.projectId
      JOIN teams t ON pt.teamId = t.id
      JOIN teamsUsers tu ON t.id = tu.teamId
      JOIN users u ON tu.userId = u.id
      WHERE u.id = $1;
    `,
      [userId]
    );

    return rows;
  } catch (error) {
    console.error('Project Error - getProjectsByPercentage:', error);
    return undefined;
  }
}

export const updateProjects = async (
  projectId: string,
  projectName: string,
  projectDescription: string,
  status: string,
  startDate: Date,
  endDate: Date
): Promise<Project | undefined> => {
  try {
    if (!isUUID(projectId)) {
      throw new Error(`Invalid UUID format: ${projectId}`);
    }

    const { rows } = await pool.query(`
      UPDATE projects
      SET projectName = $1, projectDescription = $2, status = $3, startDate = $4, endDate = $5
      WHERE id = $6
      RETURNING *;
    `,
      [projectName, projectDescription, status, startDate, endDate, projectId]
    );

    return rows[0];
  } catch (error) {
    console.error('Project Error - updateProjects:', error);
    throw new Error('Failed to update project');
  }
};

export const deleteExistingProject = async (
  projectId: string
): Promise<Project | undefined> => {
  try {
    if (!isUUID(projectId)) {
      throw new Error(`Invalid UUID format: ${projectId}`);
    }

    const { rows } = await pool.query(`
      DELETE FROM projects 
      WHERE id = $1
      RETURNING *;
    `,
      [projectId]
    );

    return rows[0];
  } catch (error) {
    console.error('Project Error - deleteExistingProject:', error);
    return undefined;
  }
};

export default Project;