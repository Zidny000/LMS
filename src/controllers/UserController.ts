import { Request, Response } from 'express';
import { validate } from 'uuid';
import { UserService } from '../services/UserService';
import { errorLogger } from '../utils/logger';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(req: Request, res: Response) {
    const { fullname, email, login, password } = req.body;

    if (!fullname || !email || !login || !password) {
      return res.status(400).json({ message: 'Fullname, email, login, password, and isActive are required' });
    }

    try {
      const newUser = await this.userService.registerUser(fullname, email, login, password);
      return res.status(201).json(newUser);
    } catch (error) {
      errorLogger.error('Error registering user:', { error, reqBody: req.body });
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getUsers(req: Request, res: Response) {
    const { fullname, email, page = 1, limit = 10 } = req.query;

    try {
      const { users, total } = await this.userService.getUsers(fullname as string, email as string, Number(page), Number(limit));
      if (users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
      return res.status(200).json({
        total,
        page: Number(page),
        limit: Number(limit),
        users,
      });
    } catch (error) {
      errorLogger.error('Error getting users:', { error, reqQuery: req.query });
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    if (!validate(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      errorLogger.error('Error getting user by ID:', { error, userId: id });
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async changePassword(req: Request, res: Response) {
    const { id } = req.params;
    const { existingPassword, newPassword } = req.body;

    if (!validate(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
      await this.userService.changePassword(id, existingPassword, newPassword);
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      if (error === 'User not found') {
        errorLogger.error('Error updating password:', { error, userId: id });
        return res.status(404).json({ message: 'User not found' });
      } else if (error === 'Existing password is incorrect') {
        errorLogger.error('Error updating password:', { error, userId: id });
        return res.status(403).json({ message: 'Existing password is incorrect' });
      } else {
        errorLogger.error('Error updating password:', { error, userId: id });
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    if (!validate(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
      await this.userService.deleteUser(id);
      return res.status(204).send();
    } catch (error) {
      if (error === 'User not found') {
        errorLogger.error('Error deleting user:', { error, userId: id });
        return res.status(404).json({ message: 'User not found' });
      } else {
        errorLogger.error('Error deleting user:', { error, userId: id });
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
}
