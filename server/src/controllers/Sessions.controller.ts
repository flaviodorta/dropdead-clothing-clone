import { Request, Response } from 'express';
import { usersServices } from '../services/Users.service';

class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const user = await usersServices.createSessions({ email, password });

    return res.json(user);
  }
}

export const sessionsController = new SessionsController();
