import pool from "./pool.js";
import { createUser } from "./users.js";
import { User } from "./users.js";
import { createTeam, createTeamUser, createTeamProject } from "./teams.js";
import Team from "./teams.js";
import { createProjects } from "./projects.js";
import Project from "./projects.js";
import { createTasks } from "./tasks.js";

const dropTables = async () => {
  await pool.query(`
    DROP TABLE IF EXISTS messages, tasks, projects_teams, teams_users, projects, teams, users CASCADE;
  `);
  console.log("🧹 Dropped all tables");
};

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      firstName VARCHAR(50) NOT NULL,
      lastName VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      token VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teams (
      id SERIAL PRIMARY KEY,
      team_name VARCHAR(50) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      project_name VARCHAR(50) NOT NULL UNIQUE,
      description TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'in-progress',
      start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      end_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      title VARCHAR(50) NOT NULL,
      description TEXT NOT NULL,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS teams_users (
      id SERIAL PRIMARY KEY,
      team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects_teams (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("🏗️ Created all tables");
};

const seedUsers = async () => {
  return await Promise.all([
    createUser('John', 'Doe', 'john@mail.com', 'hashedpassword', 'johndoe'),
    createUser('Jane', 'Smith', 'jane@mail.com', 'hashedpassword2', 'janesmith'),
  ]);
};

const seedProjects = async () => {
  return await Promise.all([
    createProjects('New Beginnings', 'Fresh TS start', 'in-progress', new Date(), new Date()),
    createProjects('Blood and Steel', 'You have been baptized in fire and blood and have come out steel!', 'in-progress', new Date(), new Date()),
  ]);
};

const seedTasks = async () => {
  return await Promise.all([
    createTasks('Task 1', 'in-progress', 'johndoe', 1),
    createTasks('Task 2', 'completed', 'janesmith', 2),
  ]);
}

const seedTeams = async () => {
  return await Promise.all([
    createTeam('Refactor Squad'),
    createTeam('Bug Bashers'),
  ]);
};

const seedRelationships = async (users: User[], teams: Team[], projects: Project[]): Promise<void> => {
  await createTeamUser(teams[0].team_name, users[0].username);
  await createTeamUser(teams[1].team_name, users[1].username);

  await createTeamProject(teams[0].team_name, projects[0].project_name);
  await createTeamProject(teams[1].team_name, projects[1].project_name);

  await createTasks('Task 1', 'Basic setup', users[0].username, projects[0].id!);
  await createTasks('Task 2', 'Final polish', users[1].username, projects[1].id!);

};

const runSeed = async () => {
  try {
    await dropTables();
    await createTables();

    const users = (await seedUsers()).filter((user: User | undefined): user is User => user !== undefined);
    console.log("✅ Seeded users");

    const projects = (await seedProjects()).filter((project: Project | undefined): project is Project => project !== undefined);
    console.log("✅ Seeded projects");

    await seedTasks();
    console.log("✅ Seeded tasks");

    const teams = (await seedTeams()).filter((team: Team | undefined): team is Team => team !== undefined);
    console.log("✅ Seeded teams");

    await seedRelationships(users, teams, projects);
    console.log("✅ Seeded relationships between users, teams, projects, and tasks");

  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    pool.end();
  }
};

runSeed();