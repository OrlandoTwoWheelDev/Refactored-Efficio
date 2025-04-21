import pool from "./pool.js";

type Team = {
  id: number;
  team_name: string;
  username: string;
  project_name: string;
}

export const createTeam = async (team_name: string): Promise<Team | undefined> => {
  try {
    const { rows } = await pool.query(`
      INSERT INTO teams (team_name)
      VALUES ($1)
      RETURNING *;
    `, [team_name]);

    console.log('Team created:', rows);
    return rows[0];
  } catch (err) {
    console.log('Error creating team:', err);
  }
};

export const createTeamUser = async (team_name: string, username: string): Promise<Team | undefined> => {
  try {
    const { rows: teamId } = await pool.query(`
      SELECT id FROM teams WHERE team_name = $1;
    `, [team_name]);

    const { rows: userId } = await pool.query(`
      SELECT id FROM users WHERE username = $1;
    `, [username]);

    if (teamId.length === 0 || userId.length === 0) {
      throw new Error('Team or User not found');
    }

    const { rows } = await pool.query(`
      INSERT INTO teams_users (team_id, user_id)
      VALUES ($1, $2)
      RETURNING *;
    `, [teamId[0].id, userId[0].id]);

    console.log('User added to team:', rows);
    return rows[0];
  } catch (err) {
    console.log('Error assigning user to team:', err);
  }
};

export const createTeamProject = async (team_name: string, project_name: string): Promise<Team | undefined> => {
  try {
    const { rows: teamId } = await pool.query(`
      SELECT id FROM teams WHERE team_name = $1;
    `, [team_name]);

    const { rows: projectId } = await pool.query(`
      SELECT id FROM projects WHERE project_name = $1;
    `, [project_name]);

    if (teamId.length === 0 || projectId.length === 0) {
      throw new Error('Team or Project not found');
    }

    const { rows } = await pool.query(`
      INSERT INTO projects_teams (team_id, project_id)
      VALUES ($1, $2)
      RETURNING *;
    `, [teamId[0].id, projectId[0].id]);

    console.log('Project added to team:', rows);
    return rows[0];
  } catch (err) {
    console.log('Error assigning project to team:', err);
  }
};

export const fetchAllTeamNames = async (): Promise<{ team_name: string }[] | undefined> => {
  try {
    const { rows: retrievedTeams } = await pool.query(`
      SELECT team_name FROM teams;
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
      SELECT t.team_name, t.id
      FROM teams t
      JOIN teams_users tu ON t.id = tu.team_id
      JOIN users u ON tu.user_id = u.id
      WHERE u.username = $1;
    `, [username]);

    return retrievedTeams.map(item => ({
      id: item.id,
      team_name: item.team_name,
      username: username,
      project_name: ''
    }));
  } catch (err) {
    console.log('Error retrieving teams for username:', err);
  }
};

export const deleteTeam = async (team_name: string) => {
  try {
    const { rows: deletedTeam } = await pool.query(`
      DELETE FROM teams WHERE team_name = $1 RETURNING *;
    `, [team_name]);

    if (!deletedTeam.length) {
      throw new Error('Team not found');
    }

    console.log('Team deleted:', deletedTeam);
    return deletedTeam;
  } catch (err) {
    console.log('Error deleting team:', err);
  }
};

export default Team;