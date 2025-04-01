const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: false,
});
console.log("dotenv config loaded:", process.env.DATABASE_URL);

const { createTeams, createTeamUser, createTeamProject, readUserId, readTeamId, readProjectId } = require('./teams.cjs');
const { createProjects } = require('./projects.cjs');
const { createUsers } = require('./users.cjs');
const { createTasks } = require('./tasks.cjs');
const { createMessages } = require('./message.cjs');

const dropTables = async () => {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS tasks CASCADE;
      DROP TABLE IF EXISTS projects_teams CASCADE;
      DROP TABLE IF EXISTS teams_users CASCADE;
      DROP TABLE IF EXISTS projects CASCADE;
      DROP TABLE IF EXISTS teams CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS messages CASCADE;
    `);
  } catch (err) {
    console.log(err);
  }
}

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE teams (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        team_name VARCHAR(75) NOT NULL
      );
      
      CREATE TABLE users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        username VARCHAR(120) UNIQUE NOT NULL,
        password VARCHAR(60) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        user_avatar TEXT
      );

      CREATE TABLE projects (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        project_name TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        created_by TEXT,
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
      );

      CREATE TABLE tasks (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        owner UUID REFERENCES users(id) NOT NULL,
        subject VARCHAR(150),
        description TEXT,
        project_id UUID REFERENCES projects(id) NOT NULL,
        priority SMALLINT,
        start_date DATE,
        end_date DATE,
        status TEXT,
        parent_task_id UUID REFERENCES tasks(id),
        sub_task_id UUID
      );

      CREATE TABLE teams_users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE projects_teams (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE
      );

      CREATE TABLE messages (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      `);
  } catch (err) {
    console.log(err);
  }
}

const connectToDatabase = async () => {
  try {
    const client = await pool.connect(); // wait for connection
    console.log('Connected to the database successfully');
    client.release(); // Don't forget to release the connection!
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
}

connectToDatabase();

const syncAndSeed = async () => {
  await pool.connect();
  console.log('CONNECTED TO THE DB');

  console.log('DROPPING TABLES');
  await dropTables();
  console.log('TABLES DROPPED');

  console.log('CREATING TABLES');
  await createTables();
  console.log('TABLES CREATED');

  const teams = ['Development', 'Design', 'Marketing', 'Technology', 'Finance', 'HR', 'Laws', 'IC'];
  const users = [
    { first_name: 'John', last_name: 'Doe', username: 'johndoe', email: 'johndoe@example.com', password: 'password123' },
    { first_name: 'Jane', last_name: 'Smith', username: 'janesmith', email: 'janesmith@example.com', password: 'pass456' },
    { first_name: 'Michael', last_name: 'Johnson', username: 'mikejohnson', email: 'mikej@example.com', password: 'secret789' },
    { first_name: 'Emily', last_name: 'Williams', username: 'emilyw', email: 'emilyw@example.com', password: 'pass321' },
    { first_name: 'Daniel', last_name: 'Brown', username: 'danbrown', email: 'danbrown@example.com', password: 'password999' },
    { first_name: 'Olivia', last_name: 'Davis', username: 'oliviad', email: 'olivia.d@example.com', password: 'securepass' },
    { first_name: 'James', last_name: 'Garcia', username: 'jamesg', email: 'jamesg@example.com', password: 'qwerty123' },
    { first_name: 'Sophia', last_name: 'Martinez', username: 'sophiam', email: 'sophiam@example.com', password: '12345secure' },
    { first_name: 'William', last_name: 'Rodriguez', username: 'williamr', email: 'williamr@example.com', password: 'pass2023' },
    { first_name: 'Isabella', last_name: 'Lee', username: 'isabellal', email: 'isabellal@example.com', password: 'mypassword1' },
  ];
  const projects = [
    { name: 'Four Winds', description: 'A project to build a new website', status: 'in-progress', start_date: '2025-01-01', end_date: '2025-06-01' },
    { name: 'Bagel Mania', description: 'A project dedicated to delicious bagels', status: 'in-progress', start_date: '2025-01-06', end_date: '2025-07-01' },
    { name: 'Tea Time', description: 'With the power of Tea, our coding prevails!', status: 'in-progress', start_date: '2025-03-01', end_date: '2025-12-01' },
  ];

  console.log('CREATING TEAMS');
  const createdTeams = await Promise.all(teams.map(team => createTeams(team)));
  console.log('TEAMS CREATED');

  console.log('CREATING USERS');
  const createdUsers = await Promise.all(users.map(user => createUsers(user.first_name, user.last_name, user.password, user.username, user.email)));
  console.log('USERS CREATED');

  console.log('CREATING PROJECTS');
  const createdProjects = await Promise.all(projects.map(project => createProjects(project.name, project.description, project.status, project.start_date, project.end_date)));
  console.log('PROJECTS CREATED');

  console.log('Messages created');
  process.exit();
}

syncAndSeed();
