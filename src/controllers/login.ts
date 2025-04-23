import { authenticateUser } from "../../db/users.js";
import { Request, Response } from "express";

export const getLoginPage = (req: Request, res: Response) => {
  res.send('Welcome to the login page!');
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    const user = await authenticateUser(email, password, username);
    if (!user) {
      res.status(401).json({ error: 'Invalid email, password, or username.' });
      return;
    }
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Server error while logging in user.' });
  }
};