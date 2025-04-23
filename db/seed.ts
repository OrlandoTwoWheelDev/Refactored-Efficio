import pool from "./pool.js";
import { createUser } from "./users.js";
import { User } from "./users.js";
import { createTeams, createTeamsUser, createTeamsProject } from "./teams.js";
import Team from "./teams.js";
import { createProjects } from "./projects.js";
import Project from "./projects.js";
import { createTasks } from "./tasks.js";

const dropTables = async () => {
  await pool.query(`
    DROP TABLE IF EXISTS messages, tasks, projectsTeams, teamsUsers, projects, teams, users CASCADE;
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
      teamName VARCHAR(50) NOT NULL UNIQUE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      projectName VARCHAR(50) NOT NULL UNIQUE,
      description TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'in-progress',
      startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      endDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      title VARCHAR(50) NOT NULL,
      description TEXT NOT NULL,
      userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
      projectId INTEGER REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS teams_users (
      id SERIAL PRIMARY KEY,
      teamId INTEGER REFERENCES teams(id) ON DELETE CASCADE,
      userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects_teams (
      id SERIAL PRIMARY KEY,
      projectId INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      teamId INTEGER REFERENCES teams(id) ON DELETE CASCADE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
      teamId INTEGER REFERENCES teams(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    createTeams('Refactor Squad'),
    createTeams('Bug Bashers'),
  ]);
};

const seedRelationships = async (users: User[], teams: Team[], projects: Project[]): Promise<void> => {
  await createTeamsUser(teams[0].teamName, users[0].username);
  await createTeamsUser(teams[1].teamName, users[1].username);

  await createTeamsProject(teams[0].teamName, projects[0].projectName);
  await createTeamsProject(teams[1].teamName, projects[1].projectName);

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