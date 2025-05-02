import pool from "./pool.js";
import { getUserById } from "./users.js";

export type Message = {
  id: number;
  userid: number;
  username: string;
  teamid: number;
  content: string;
  createdat: Date;
  updatedat: Date;
};

export const createMessage = async (
  userid: number,
  teamid: number,
  content: string
): Promise<Message | undefined> => {
  try {
    const { rows } = await pool.query(
      `
      INSERT INTO messages (userid, teamid, content)
      VALUES ($1, $2, $3)
      RETURNING id, userid, teamid, content, createdat, updatedat;
    `,
      [userid, teamid, content]
    );
    const newMessage = rows[0];

    return {
      id: newMessage.id,
      userid: newMessage.userid,
      username: (await getUserById(newMessage.userid))?.username || 'Unknown',
      teamid: newMessage.teamid,
      content: newMessage.content,
      createdat: newMessage.createdat,
      updatedat: newMessage.updatedat
    };
  } catch (error) {
    console.error('Error creating message:', error);
    return undefined;
  }
};


export const getMessages = async (teamid: number): Promise<Message[]> => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        m.id,
        m.userid AS userid,
        m.teamid AS teamid,
        m.content,
        m.createdat AS createdat,
        m.updatedat AS updatedat,
        u.username  -- Add this to get the username from the users table
      FROM messages m
      JOIN users u ON m.userid = u.id  -- Join to fetch the username
      WHERE m.teamid = $1
      ORDER BY m.createdat DESC;
    `, [teamid]);

    return rows.map((row: any) => ({
      id: row.id,
      userid: row.userid,
      teamid: row.teamid,
      content: row.content,
      createdat: row.createdat,
      updatedat: row.updatedat,
      username: row.username
    }));
  } catch (err) {
    console.error('Error fetching messages:', err);
    return [];
  }
};