import { Request, Response } from "express";
import { fetchMyAccountInfo, updatingAccountInfo, deleteAccount } from "../../db/users.js";

export const getMyAccountPage = (req: Request, res: Response) => {
  res.send('Welcome to your account page!');
};

export const getAccountInfo = async (req: Request, res: Response) => {
  try {
    const username = req.body.username || req.query.username || req.params.username;
    const info = await fetchMyAccountInfo(username);
    if (!info) {
      res.status(404).json({ error: 'Account info not found.' });
      return;
    }
  } catch (error) {
    console.error('Error fetching account info:', error);
    res.status(500).json({ error: 'Server error while fetching account info.' });
  }
};

export const updateAccountInfo = async (req: Request, res: Response): Promise <void> => {
  try {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.username) {
      res.status(400).json({ error: 'All fields are required to update the account.' });
      return;
    }    

    const updatedInfo = await updatingAccountInfo(
      req.body.id,
      req.body.firstName,
      req.body.lastName,
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
    const userId = req.body.id;
    await deleteAccount(userId);
    res.json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Error deleting account info:', error);
    res.status(500).json({ error: 'Server error while deleting account info.' });
  }
};