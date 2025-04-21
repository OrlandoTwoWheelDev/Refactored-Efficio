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
      INSERT INTO messages (user_id, team_id, content)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, team_id, content, created_at, updated_at;
    `,
      [userId, teamId, content]
    );
    const newMessage = rows[0];

    return {
      id: newMessage.id,
      userId: newMessage.user_id,
      username: (await getUserById(newMessage.user_id))?.username || 'Unknown',
      teamId: newMessage.team_id,
      content: newMessage.content,
      createdAt: newMessage.created_at,
      updatedAt: newMessage.updated_at
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
        m.user_id AS userId,
        m.team_id AS teamId,
        m.content,
        m.created_at AS createdAt,
        m.updated_at AS updatedAt,
        u.username  -- Add this to get the username from the users table
      FROM messages m
      JOIN users u ON m.user_id = u.id  -- Join to fetch the username
      WHERE m.team_id = $1
      ORDER BY m.created_at DESC;
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