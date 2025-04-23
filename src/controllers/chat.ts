import { Request, Response } from 'express';
import { getMessages } from '../../db/messages.js';

export const getChatPage = (req: Request, res: Response) => {
  res.send('Welcome to the chat page!');
};

export const getChat = async (req: Request, res: Response) => {
  try {
    const teamId = Number(req.params.teamId);
  const chat = await getMessages(teamId);
  if (!chat) {
    res.status(400).json({ error: 'Failed to fetch chat messages.' });
    return;
  }
  res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching chat messages.' });
  }
};