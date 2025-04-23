import pool from "./pool.js";

type Team = {
  id: number;
  teamName: string;
  username: string;
  projectName: string;
}

export const createTeams = async (teamName: string): Promise<Team | undefined> => {
  try {
    const { rows } = await pool.query(`
      INSERT INTO teams (teamName)
      VALUES ($1)
      RETURNING *;
    `, [teamName]);

    console.log('Team created:', rows);
    return rows[0];
  } catch (err) {
    console.log('Error creating team:', err);
  }
};

export const createTeamsUser = async (teamName: string, username: string): Promise<Team | undefined> => {
  try {
    const { rows: teamId } = await pool.query(`
      SELECT id FROM teams WHERE teamName = $1;
    `, [teamName]);

    const { rows: userId } = await pool.query(`
      SELECT id FROM users WHERE username = $1;
    `, [username]);

    if (teamId.length === 0 || userId.length === 0) {
      throw new Error('Team or User not found');
    }

    const { rows } = await pool.query(`
      INSERT INTO teamsUsers (teamId, userId)
      VALUES ($1, $2)
      RETURNING *;
    `, [teamId[0].id, userId[0].id]);

    console.log('User added to team:', rows);
    return rows[0];
  } catch (err) {
    console.log('Error assigning user to team:', err);
  }
};

export const createTeamsProject = async (teamName: string, projectName: string): Promise<Team | undefined> => {
  try {
    const { rows: teamId } = await pool.query(`
      SELECT id FROM teams WHERE teamName = $1;
    `, [teamName]);

    const { rows: projectId } = await pool.query(`
      SELECT id FROM projects WHERE projectName = $1;
    `, [projectName]);

    if (teamId.length === 0 || projectId.length === 0) {
      throw new Error('Team or Project not found');
    }

    const { rows } = await pool.query(`
      INSERT INTO projectsTeams (teamId, projectId)
      VALUES ($1, $2)
      RETURNING *;
    `, [teamId[0].id, projectId[0].id]);

    console.log('Project added to team:', rows);
    return rows[0];
  } catch (err) {
    console.log('Error assigning project to team:', err);
  }
};

export const getAllTeams = async (): Promise<{ team_name: string }[] | undefined> => {
  try {
    const { rows: retrievedTeams } = await pool.query(`
      SELECT teamName FROM teams;
    `);

    return retrievedTeams;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
;

export const retrieveTeamsByUsername = async (username: string): Promise<Team[] | undefined> => {
  try {
    const { rows: retrievedTeams } = await pool.query(`
      SELECT t.teamName, t.id
      FROM teams t
      JOIN teamsUsers tu ON t.id = tu.teamId
      JOIN users u ON tu.userId = u.id
      WHERE u.username = $1;
    `, [username]);

    return retrievedTeams.map(item => ({
      id: item.id,
      teamName: item.teamName,
      username: username,
      projectName: ''
    }));
  } catch (err) {
    console.log('Error retrieving teams for username:', err);
  }
};

export const deleteTeams = async (teamName: string) => {
  try {
    const { rows: deletedTeam } = await pool.query(`
      DELETE FROM teams WHERE teamName = $1 RETURNING *;
    `, [teamName]);

    if (!deletedTeam.length) {
      throw new Error('Team not found');
    }

    console.log('Team deleted:', deletedTeam);
    return deletedTeam;
  } catch (err) {
    console.log('Error deleting team:', err);
  }
};

export const updateTeams = async (teamName: string, newTeamName: string) => {
  try {
    const { rows } = await pool.query(`
      UPDATE teams
      SET teamName = $1
      WHERE teamName = $2
      RETURNING *;
    `, [newTeamName, teamName]);

    if (!rows.length) {
      throw new Error('Team not found');
    }

    console.log('Team updated:', rows);
    return rows[0];
  } catch (err) {
    console.log('Error updating team:', err);
  }
};

export default Team;