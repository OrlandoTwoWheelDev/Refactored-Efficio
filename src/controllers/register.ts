import { createUser } from "../../db/users.js";
import { Request, Response } from "express";

export const getRegisterPage = (req: Request, res: Response) => {
  res.send('Welcome to the register page!');
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, username } = req.body;
    const user = await createUser(firstName, lastName, email, password, username);
    if (!user) {
      res.status(400).json({ error: 'Failed to register user.' });
      return;
    }
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error while registering user.' });
  }
};