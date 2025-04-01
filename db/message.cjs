const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: false,
});


const createMessages = async (content, userId, teamId) => {
  const query = {
    text: 'INSERT INTO messages (content, user_id, team_id) VALUES ($1, $2, $3) RETURNING *',
    values: [content, userId, teamId]
  };

  try {
    const res = await pool.query(query);
    console.log('Message inserted:', res.rows[0]);
    return res.rows[0];
  } catch (error) {
    console.error('Error inserting message:', error);
  }
};

module.exports = { createMessages };