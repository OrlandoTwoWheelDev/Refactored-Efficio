const pool = require('./Pool.cjs');

const createTeams = async(team_name) => {
  try{
    const{ rows } = await pool.query(`
       INSERT INTO teams (team_name)
       VALUES ($1)
       RETURNING *;
    `,[team_name])

    console.log('Team created:', rows);
    return rows[0];
  } catch(err) {
    console.log(err);
  }
}


const createTeamUser = async(team_id,user_id) => {
  try{
    const{ rows } = await pool.query(`
       INSERT INTO teams_users (team_id,user_id)
       VALUES ($1,$2)
       RETURNING *;
    `,[team_id,user_id])

    console.log('The User has been Assigned to a Team:', rows);
    return rows[0];
  } catch(err) {
    console.log(err);
  }
}


const createTeamProject = async(team_id,project_id) => {
  try{
    const{ rows } = await pool.query(`
      INSERT INTO projects_teams (team_id,project_id)
      VALUES ($1,$2)
      RETURNING *;
      `,[team_id,project_id])
      
      console.log('The Project has been Assigned to a Team:', rows);
      return rows[0];
    } catch(err) {
      console.log(err);
    }
  }
  
  const readUserId = async(username) => {
    try{
      const{ rows: userId } = await pool.query(`
         SELECT id FROM users
         WHERE username = $1;
      `,[username])

      return userId[0].id;
    } catch(err) {
      console.log(err);
    }
  }
  
  
  const readTeamId = async(team_name) => {
    try{
      const{ rows: teamId } = await pool.query(`
         SELECT id FROM teams
         WHERE team_name = $1;
      `,[team_name])
  
      return teamId[0].id;
    } catch(err) {
      console.log(err);
    }
  }


  const readProjectId = async(projectname) => {
    try{
      const{ rows: projectId } = await pool.query(`
         SELECT id FROM projects
         WHERE project_name = $1;
      `,[projectname])
  
      return projectId[0].id;
    } catch(err) {
      console.log(err);
    }
  }


  const fetchAllTeamNames = async() => {
    try {
      const { rows: retrievedTeams } = await pool.query(`
        SELECT team_name FROM teams;
      `);
  
      return retrievedTeams;
    } catch(err) {
      console.log(err);
    }
  }



  const retrieveTeamsByUsername = async(username) => {
    try {
      const { rows: retrievedTeams } = await pool.query(`
        SELECT distinct t.team_name,t.id
        FROM teams t
        JOIN teams_users tu ON t.id = tu.team_id
        JOIN users u ON tu.user_id = u.id
        WHERE u.username = $1;
      `,[username]);

      const teamNames = retrievedTeams.map(item => item.team_name);

      return teamNames;
    } catch(err) {
      console.log(err);
    }
  }

  
// need modify
  const assignUserToTeams = async(team_name, username) => {
    try {
      const { rows: assignedUsersToTeams } = await pool.query(`
       INSERT INTO teams_users (team_id, user_id)
        VALUES (
          (SELECT id FROM teams WHERE team_name = $1),
          (SELECT id FROM users WHERE username = $2)
        );
      `,[team_name, username]);
  
      return assignedUsersToTeams;
    } catch(err) {
      console.log(err);
    }
  }


  const deleteExistingTeams = async(team_name) => {
    try {
      const { rows: deletedTeam } = await pool.query(`
        DELETE FROM teams 
        WHERE team_name = $1
        RETURNING *
        `, [team_name]);
  
        if (deletedTeam) {
          return deletedTeam;
        } else {
          throw Error({message:`Team not found`});
        }
    } catch (err) {
      console.log(err);
    }
  }
  
  
module.exports = { 
  createTeams,
  createTeamUser,
  createTeamProject,
  fetchAllTeamNames,
  retrieveTeamsByUsername,
  assignUserToTeams,
  deleteExistingTeams,
  readUserId,
  readTeamId,
  readProjectId };