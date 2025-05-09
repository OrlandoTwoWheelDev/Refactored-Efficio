import { Request, Response } from "express";
import { fetchMyAccountInfo, updatingAccountInfo, deleteAccount } from "../../db/users.js";
import { User } from "../../db/users.js";

export const getMyAccountPage = (req: Request, res: Response) => {
  res.send('Welcome to your account page!');
};

export const getAccountInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('User from token:', req.user); // Debugging line

    const user = req.user as Partial<User>;
    if (!user || !user.username) {
      res.status(400).json({ error: 'Username is required.' });
      return;
    }

    const username = user.username;
    const rows = await fetchMyAccountInfo(username);
    console.log('Fetched account info:', rows); // Debugging line

    if (!rows || rows.length === 0) {
      res.status(404).json({ error: 'Account info not found.' });
      return;
    }

    const accountInfo = {
      firstname: rows[0].firstname,
      lastname: rows[0].lastname,
      email: rows[0].email,
      username: rows[0].username,
      teamname: rows[0].teamname || undefined,
    };

    res.json({ user: accountInfo });
  } catch (error) {
    console.error('Error fetching account info:', error);
    res.status(500).json({ error: 'Server error while fetching account info.' });
  }
};


export const updateAccountInfo = async (req: Request, res: Response): Promise <void> => {
  try {
    if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.username) {
      res.status(400).json({ error: 'All fields are required to update the account.' });
      return;
    }    

    const updatedInfo = await updatingAccountInfo(
      req.body.id,
      req.body.firstname,
      req.body.lastname,
      req.body.email,
      req.body.password,
      req.body.username
    );
    if (!updatedInfo) {
      res.status(404).json({ error: 'Account info not found.' });
      return;
    }
    res.json({ message: 'Account info updated successfully.', data: updatedInfo });
  } catch (error) {
    console.error('Error updating account info:', error);
    res.status(500).json({ error: 'Server error while updating account info.' });
  }
};

export const deleteAccountInfo = async (req: Request, res: Response) => {
  try {
    const userid = req.body.id;
    await deleteAccount(userid);
    res.json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Error deleting account info:', error);
    res.status(500).json({ error: 'Server error while deleting account info.' });
  }
};