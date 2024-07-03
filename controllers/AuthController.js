#!/usr/bin/node

import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { getAuthHeader, getToken, pwdHashed, decodeToken, getCredentials } from '../utils/auth';

class AuthController {
  static async getConnect(req, res) {
    const authHeader = getAuthHeader(req);
    if (!authHeader) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const token = getToken(authHeader);
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const decodedToken = decodeToken(token);
    if (!decodedToken) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const { email, password } = getCredentials(decodedToken);
    const user = await dbClient.getUser(email);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (user.password !== pwdHashed(password)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const accessToken = uuidv4();
    await redisClient.set(`auth_${accessToken}`, user._id.toString(), 864000);
    res.json({ token: accessToken });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const id = await redisClient.get(`auth_${token}`);
    if (!id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const user = await dbClient.getUserById(id);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    await redisClient.del(`auth_${token}`);
    res.status(204).end();
  }
}

const authController = new AuthController();
export default authController;
