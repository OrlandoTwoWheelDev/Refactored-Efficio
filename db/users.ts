import pool from './pool.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../src/utilities/env.js';

export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  token?: string;
};

export const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  username: string,
): Promise<User | undefined> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `
      INSERT INTO users (firstName, lastName, email, password, username)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [firstName, lastName, email, hashedPassword, username],
    );
    return rows[0];
  } catch (err) {
    console.error('Error creating user:', err);
    return undefined;
  }
};

export const authenticateUser = async (
  email: string,
  password: string,
  username: string,
): Promise<User | undefined> => {
  try {
    const { rows } = await pool.query(
      `
      SELECT * FROM users
      WHERE email = $1 AND username = $2
    `,
      [email, username],
    );
    if (rows.length === 0) {
      return undefined;
    }
    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return undefined;
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    return { ...user, token };
  } catch (err) {
    console.error('Error authenticating user:', err);
    return undefined;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM users
    `);
    return rows;
  } catch (err) {
    console.error('Error getting all users:', err);
    return [];
  }
};

export const getUserById = async (id: number): Promise<User | undefined> => {
  try {
    const { rows } = await pool.query(
      `
      SELECT * FROM users
      WHERE id = $1
    `,
      [id],
    );
    return rows[0];
  } catch (err) {
    console.error('Error getting user by ID:', err);
    return undefined;
  }
};

export const loginToken = async (token: string): Promise<User | undefined> => {
  try {
    const { rows } = await pool.query(
      `
      SELECT * FROM users
      WHERE token = $1
    `,
      [token],
    );
    if (rows.length === 0) {
      return undefined;
    }
    return rows[0];
  } catch (err) {
    console.error('Error logging in user:', err);
    return undefined;
  }
};

export const getUserByTeamName = async (
  teamName: string,
): Promise<User | undefined> => {
  try {
    const { rows } = await pool.query(
      `
      SELECT u.*
      FROM users u
      JOIN teamsUsers tu ON u.id = tu.userId
      JOIN teams t ON tu.teamId = t.id
      WHERE t.teamName = $1
    `,
      [teamName],
    );
    if (rows.length === 0) {
      return undefined;
    }
    return rows[0];
  } catch (err) {
    console.error('Error getting user by team name:', err);
    return undefined;
  }
};

export const fetchMyAccountInfo = async (username: string) => {
  try {
    const { rows: myAccountInfo } = await pool.query(`
    WITH userTeam AS (
    SELECT 
      u.id AS userId,
      u.firstName,
      u.lastName,
      u.email,
      u.username,
      t.id AS teamId,
      t.teamName
      FROM users u
      JOIN teamsUsers tu ON u.id = tu.userId
      JOIN teams t ON tu.teamId = t.id
      )
    SELECT 
      currentUser.firstName AS user_firstName,
      currentUser.lastName AS user_lastName,
      currentUser.email AS user_email,
      currentUser.username AS user_username,
      currentUser.teamName AS user_teamName,
      teammate.firstName AS teammate_firstName,
      teammate.lastName AS teammate_lastName,
      teammate.email AS teammate_email,
      teammate.username AS teammate_username
    FROM userTeam currentUser
    LEFT JOIN userTeam teammate 
      ON currentUser.teamId = teammate.teamId
      AND currentUser.userId <> teammate.userId
    WHERE currentUser.username = $1;
    `,
      [username],
    );

    return myAccountInfo;
  } catch (err) {
    console.error('Error fetching account info:', err);
    throw err;
  }
};

export const updatingAccountInfo = async (
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  username: string
): Promise<User | undefined> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `
      UPDATE users
      SET firstName = $1, lastName = $2, email = $3, password = $4, username = $5
      WHERE id = $6
      RETURNING *
      `,
      [firstName, lastName, email, hashedPassword, username, id]
    );
    return rows[0];
  } catch (err) {
    console.error('Error updating account info:', err);
    return undefined;
  }
};

export const deleteAccount = async (id: number): Promise<void> => {
  try {
    await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
    `,
      [id],
    );
  } catch (err) {
    console.error('Error deleting account:', err);
  }
};