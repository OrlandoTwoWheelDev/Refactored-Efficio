import pool from './pool.js';

type Team = {
  id: number;
  teamname: string;
  username: string;
  projectname: string;
};

export const createTeams = async (
  teamname: string,
): Promise<Team | undefined> => {
  try {
    const { rows } = await pool.query(
      `
      INSERT INTO teams (teamname)
      VALUES ($1)
      RETURNING *;
    `,
      [teamname],
    );

    console.log('Team created:', rows);
    return rows[0];
  } catch (err) {
    console.log('Error creating team:', err);
  }
};

export const createTeamsUser = async (
  teamname: string,
  username: string,
): Promise<Team | undefined> => {
  try {
    const { rows: teamid } = await pool.query(
      `
      SELECT id FROM teams WHERE teamname = $1;
    `,
      [teamname],
    );

    const { rows: userid } = await pool.query(
      `
      SELECT id FROM users WHERE username = $1;
    `,
      [username],
    );

    if (teamid.length === 0 || userid.length === 0) {
      throw new Error('Team or User not found');
    }

    const { rows } = await pool.query(
      `
      INSERT INTO teamsusers (teamid, userid)
      VALUES ($1, $2)
      RETURNING *;
    `,
      [teamid[0].id, userid[0].id],
    );

    console.log('User added to team:', rows);
    return rows[0];
  } catch (err) {
    console.log('Error assigning user to team:', err);
  }
};

export const createTeamsProject = async (
  teamname: string,
  projectname: string,
): Promise<Team | undefined> => {
  try {
    const { rows: teamid } = await pool.query(
      `
      SELECT id FROM teams WHERE teamname = $1;
    `,
      [teamname],
    );

    const { rows: projectid } = await pool.query(
      `
      SELECT id FROM projects WHERE projectname = $1;
    `,
      [projectname],
    );

    if (teamid.length === 0 || projectid.length === 0) {
      throw new Error('Team or Project not found');
    }

    const { rows } = await pool.query(
      `
      INSERT INTO projectsteams (teamid, projectid)
      VALUES ($1, $2)
      RETURNING *;
    `,
      [teamid[0].id, projectid[0].id],
    );

    console.log('Project added to team:', rows);
    return rows[0];
  } catch (err) {
    console.log('Error assigning project to team:', err);
  }
};

export const getAllTeams = async (): Promise<
  { team_name: string }[] | undefined
> => {
  try {
    const { rows: retrievedTeams } = await pool.query(`
      SELECT * FROM teams;
    `);

    return retrievedTeams;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
export const retrieveTeamsByUsername = async (
  username: string,
): Promise<Team[] | undefined> => {
  try {
    const { rows: retrievedTeams } = await pool.query(
      `
      SELECT t.teamname, t.id
      FROM teams t
      JOIN teamsusers tu ON t.id = tu.teamid
      JOIN users u ON tu.userid = u.id
      WHERE u.username = $1;
    `,
      [username],
    );

    return retrievedTeams.map((item) => ({
      id: item.id,
      teamname: item.teamname,
      username: username,
      projectname: '',
    }));
  } catch (err) {
    console.log('Error retrieving teams for username:', err);
  }
};

export const deleteTeams = async (teamname: string) => {
  try {
    const { rows: deletedTeam } = await pool.query(
      `
      DELETE FROM teams WHERE teamname = $1 RETURNING *;
    `,
      [teamname],
    );

    if (!deletedTeam.length) {
      throw new Error('Team not found');
    }

    console.log('Team deleted:', deletedTeam);
    return deletedTeam;
  } catch (err) {
    console.log('Error deleting team:', err);
  }
};

export const updateTeams = async (teamname: string, newteamname: string) => {
  try {
    const { rows } = await pool.query(
      `
      UPDATE teams
      SET teamname = $1
      WHERE teamname = $2
      RETURNING *;
    `,
      [newteamname, teamname],
    );

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
