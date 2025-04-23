import pool from "./pool.js";
import { getUserById } from "./users.js";

export type Message = {
  id: number;
  userId: number;
  username: string;
  teamId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export const createMessage = async (
  userId: number,
  teamId: number,
  content: string
): Promise<Message | undefined> => {
  try {
    const { rows } = await pool.query(
      `
      INSERT INTO messages (userId, teamId, content)
      VALUES ($1, $2, $3)
      RETURNING id, userId, teamId, content, createdAt, updatedAt;
    `,
      [userId, teamId, content]
    );
    const newMessage = rows[0];

    return {
      id: newMessage.id,
      userId: newMessage.userId,
      username: (await getUserById(newMessage.userId))?.username || 'Unknown',
      teamId: newMessage.teamId,
      content: newMessage.content,
      createdAt: newMessage.createdAt,
      updatedAt: newMessage.updatedAt
    };
  } catch (error) {
    console.error('Error creating message:', error);
    return undefined;
  }
};


export const getMessages = async (teamId: number): Promise<Message[]> => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        m.id,
        m.userId AS userId,
        m.teamId AS teamId,
        m.content,
        m.createdAt AS createdAt,
        m.updatedAt AS updatedAt,
        u.username  -- Add this to get the username from the users table
      FROM messages m
      JOIN users u ON m.userId = u.id  -- Join to fetch the username
      WHERE m.teamId = $1
      ORDER BY m.createdAt DESC;
    `, [teamId]);

    return rows.map((row: any) => ({
      id: row.id,
      userId: row.userId,
      teamId: row.teamId,
      content: row.content,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      username: row.username
    }));
  } catch (err) {
    console.error('Error fetching messages:', err);
    return [];
  }
};