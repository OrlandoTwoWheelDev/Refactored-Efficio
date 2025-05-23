import pool from './pool.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../src/utilities/env.js';

export type User = {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  username: string;
  token?: string;
};

export const createUser = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  username: string,
  teamname?: string,
): Promise<User | undefined> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `
      INSERT INTO users (firstname, lastname, email, password, username, teamname)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [firstname, lastname, email, hashedPassword, username, teamname],
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
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
    );
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

export const getUserByTeamName = async (
  teamname: string,
): Promise<User | undefined> => {
  try {
    const { rows } = await pool.query(
      `
      SELECT u.*
      FROM users u
      JOIN teamsusers tu ON u.username = tu.username
      JOIN teams t ON tu.teamid = t.id
      WHERE t.teamname = $1
    `,
      [teamname],
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
    const { rows } = await pool.query(
      `
      SELECT 
        u.firstname,
        u.lastname,
        u.email,
        u.username,
        t.teamname
      FROM users u
      LEFT JOIN teamsusers tu ON u.username = tu.username
      LEFT JOIN teams t ON tu.teamid = t.id
      WHERE u.username = $1;
      `,
      [username],
    );

    return rows[0];
  } catch (err) {
    console.error('Error fetching account info:', err);
    throw err;
  }
};



export const updatingAccountInfo = async (
  id: number,
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  username: string,
): Promise<User | undefined> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `
      UPDATE users
      SET firstname = $1, lastname = $2, email = $3, password = $4, username = $5
      WHERE id = $6
      RETURNING *
      `,
      [firstname, lastname, email, hashedPassword, username, id],
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
