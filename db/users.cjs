const pool = require('./Pool.cjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUsers = async (first_name, last_name, password, username, email) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(`
      INSERT INTO users(first_name, last_name, password, username, email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, [first_name, last_name, hashedPassword, username, email]);
      
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async() => {
  try{
    const { rows } = await pool.query(`
      SELECT * FROM users;
      `);
      return rows;
  }catch(err){
    throw err
  }
}

const authenticateUser = async (username, password) => {
  console.log("Inside authenticateUser with username:", username);
  try {
    const { rows } = await pool.query(`
      SELECT * FROM users WHERE username = $1;
    `, [username]);

    console.log(rows[0]);
    const user = rows[0];

    if (user) {
      console.log(user);
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      console.log(isPasswordMatch);
      if (isPasswordMatch) {
        console.log("Authenticated user:", user);

        const token = jwt.sign(
          { username: user.username, user_id: user.id },
          process.env.JWT_SECRET
        );
        
        
        console.log(token);
        console.log("Generated Token:", token);
        return token;
      } else {
        throw new Error('No User Found');
      }
    } else {
      throw new Error('No User Found');
    }
  } catch (err) {
    throw new Error('No User Found');
  }
}


const logInWithToken = async (token) => {
  try {
    const usefulInfo = await jwt.verify(token, process.env.JWT_SECRET);

    const { rows } = await pool.query(`
      SELECT * FROM users WHERE id='${usefulInfo.user_id}'
    `);

    const user = rows[0];

    if (user) {
      return { username: user.username };
    } else {
      return { message: 'Bad Token' };
    }
  } catch (err) {
    throw err;
  }
}



const fetchUsersByTeamName = async (team_name) => {
  try {
    const { rows: usersByTeamNames } = await pool.query(`
      SELECT distinct users.username
      FROM users
      JOIN teams_users ON users.id = teams_users.user_id
      JOIN teams ON teams_users.team_id = teams.id
      WHERE teams.team_name = $1;
    `,[team_name]);
    return usersByTeamNames
  } catch (err) {
    throw err;
  }
}


const fetchMyAccountInfo = async (username) => {
  try {
    const { rows: myAccountInfo } = await pool.query(`
      WITH user_team AS (
        SELECT 
          u.id AS user_id,
          u.first_name,
          u.last_name,
          u.email,
          u.username,
          t.id AS team_id,
          t.team_name
        FROM users u
        JOIN teams_users tu ON u.id = tu.user_id
        JOIN teams t ON tu.team_id = t.id
      )
    SELECT 
      ut1.first_name AS user_first_name,
      ut1.last_name AS user_last_name,
      ut1.email AS user_email,
      ut1.username AS user_username,
      ut1.team_name,
      ut2.first_name AS teammate_first_name,
      ut2.last_name AS teammate_last_name,
      ut2.email AS teammate_email,
      ut2.username AS teammate_username
    FROM user_team ut1
    LEFT JOIN user_team ut2 
      ON ut1.team_id = ut2.team_id 
      AND ut1.user_id <> ut2.user_id
    WHERE ut1.username = $1;
    `,[username]);
    return myAccountInfo
  } catch (err) {
    throw err;
  }
}

module.exports = { createUsers, getAllUsers, 
  authenticateUser, logInWithToken, fetchUsersByTeamName, 
  fetchMyAccountInfo };