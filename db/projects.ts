import pool from './pool.js';


type Project = {
  id: number;
  projectname: string;
  projectdescription: string;
  status: string;
  startdate: Date;
  enddate: Date;
  userid: number;
};

export const createProjects = async (
  projectname: string,
  projectdescription: string,
  status: string,
  startdate: Date,
  enddate: Date,
  userid: number
): Promise<Project> => {
  try {
    const { rows } = await pool.query(`
      INSERT INTO projects (projectname, projectdescription, status, startdate, enddate, userid)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `,
      [projectname, projectdescription, status, startdate, enddate, userid]
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
  teamid: string
): Promise<Project[] | undefined> => {
  try {
    if (!(teamid)) {
      throw new Error(`Invalid UUID format: ${teamid}`);
    }

    const { rows } = await pool.query(`
      SELECT projects.* FROM projects
      JOIN projectsteams ON projects.id = projectsteams.projectid
      WHERE projectsteams.teamid = $1;
    `,
      [teamid]
    );

    return rows;
  } catch (error) {
    console.error('Project Error - getProjectsByTeams:', error);
    return undefined;
  }
};

export const getProjectsByUsers = async (
  userid: number
): Promise<Project[] | undefined> => {
  try {
    if (!(userid.toString())) {
      throw new Error(`Invalid UUID format: ${userid}`);
    }

    const { rows } = await pool.query(`
      SELECT projects.* FROM projects
      JOIN projectsteams ON projects.id = projectsteams.projectid
      JOIN teamsusers ON projectsteams.teamid = teamsusers.teamid
      WHERE teamsusers.userid = $1;
    `,
      [userid]
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
      JOIN projectsteams pt ON p.id = pt.projectid
      JOIN teams t ON pt.teamid = t.id
      JOIN teamsusers tu ON t.id = tu.teamid
      JOIN users u ON tu.userid = u.id
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
  userid: number
): Promise<Project[] | undefined> => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT p.*
      FROM projects p
      JOIN projectsteams pt ON p.id = pt.projectid
      JOIN teams t ON pt.teamid = t.id
      JOIN teamsusers tu ON t.id = tu.teamid
      JOIN users u ON tu.userid = u.id
      WHERE u.id = $1;
    `,
      [userid]
    );

    return rows;
  } catch (error) {
    console.error('Project Error - getProjectsByPercentage:', error);
    return undefined;
  }
}

export const updateProjects = async (
  projectid: string,
  projectname: string,
  projectdescription: string,
  status: string,
  startdate: Date,
  enddate: Date
): Promise<Project | undefined> => {
  try {
    if (!(projectid)) {
      throw new Error(`Invalid UUID format: ${projectid}`);
    }

    const { rows } = await pool.query(`
      UPDATE projects
      SET projectname = $1, projectdescription = $2, status = $3, startdate = $4, enddate = $5
      WHERE id = $6
      RETURNING *;
    `,
      [projectname, projectdescription, status, startdate, enddate, projectid]
    );

    return rows[0];
  } catch (error) {
    console.error('Project Error - updateProjects:', error);
    throw new Error('Failed to update project');
  }
};

export const deleteExistingProject = async (
  projectid: string
): Promise<Project | undefined> => {
  try {
    if (!(projectid)) {
      throw new Error(`Invalid UUID format: ${projectid}`);
    }

    const { rows } = await pool.query(`
      DELETE FROM projects 
      WHERE id = $1
      RETURNING *;
    `,
      [projectid]
    );

    return rows[0];
  } catch (error) {
    console.error('Project Error - deleteExistingProject:', error);
    return undefined;
  }
};

export default Project;