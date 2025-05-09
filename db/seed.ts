import pool from "./pool.js";
import { createUser } from "./users.js";
import { User } from "./users.js";
import { createTeamsProject, createTeamWithOwner } from "./teams.js";
import Team from "./teams.js";
import { createProjects } from "./projects.js";
import Project from "./projects.js";
import { createTasks } from "./tasks.js";

const dropTables = async () => {
  await pool.query(`
    DROP TABLE IF EXISTS users, teams, projects, tasks, teamsusers, projectsteams, messages CASCADE;
  `);
  console.log("🧹 Dropped all tables");
};

const createTables = async () => {
  try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(50) NOT NULL,
      lastname VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      token VARCHAR(255),
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teams (
      id SERIAL PRIMARY KEY,
      teamname VARCHAR(50) NOT NULL UNIQUE,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      projectname VARCHAR(50) NOT NULL UNIQUE,
      projectdescription TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'active',
      startdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      enddate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(50) NOT NULL,
      description TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'active',
      projectid INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      startdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      enddate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teamsusers (
      id SERIAL PRIMARY KEY,
      teamid INTEGER REFERENCES teams(id) ON DELETE CASCADE,
      role VARCHAR(20) DEFAULT 'member',
      userid INTEGER REFERENCES users(id) ON DELETE CASCADE,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projectsteams (
      id SERIAL PRIMARY KEY,
      projectid INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      teamid INTEGER REFERENCES teams(id) ON DELETE CASCADE,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      userid INTEGER REFERENCES users(id) ON DELETE CASCADE,
      teamid INTEGER REFERENCES teams(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("🏗️ Created all tables");
  }catch (err) {
    console.error("❌ Error creating tables:", err);
  }
};

const seedUsers = async () => {
  return await Promise.all([
    createUser('John', 'Doe', 'john@mail.com', 'hashedpassword', 'johndoe'),
    createUser('Jane', 'Smith', 'jane@mail.com', 'hashedpassword2', 'janesmith'),
  ]);
};

const seedProjects = async () => {
  return await Promise.all([
    createProjects('New Beginnings', 'Fresh TS start', 'in-progress', new Date(), new Date(), 1),
    createProjects('Blood and Steel', 'You have been baptized in fire and blood and have come out steel!', 'in-progress', new Date(), new Date(), 2),
  ]);
};

const seedTasks = async () => {
  return await Promise.all([
    createTasks('Task 1', 'Basic setup', 'in-progress', 1, new Date(), new Date(), 1),
    createTasks('Task 2', 'Final polish', 'in-progress', 2, new Date(), new Date(), 2),
  ]);
};

const seedTeams = async () => {
  return await Promise.all([
    createTeamWithOwner('Refactor Squad', 'johndoe'),
    createTeamWithOwner('Bug Bashers', 'janesmith'),
  ]);
};

const seedRelationships = async (users: User[], teams: Team[], projects: Project[]): Promise<void> => {
  await createTeamWithOwner(teams[0].teamname, users[0].username);
  await createTeamWithOwner(teams[1].teamname, users[1].username);

  await createTeamsProject(teams[0].teamname, projects[0].projectname);
  await createTeamsProject(teams[1].teamname, projects[1].projectname);

  await createTasks('Task 1', 'Basic setup', 'in-progress', projects[0].id!, new Date(), new Date(), users[0].id!);
  await createTasks('Task 2', 'Final polish', 'in-progress', projects[1].id!, new Date(), new Date(), users[1].id!);
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
