import crypto from 'crypto';
import dbClient from '../utils/db';

const UsersController = {
  async postNew(req, resp) {
    const { email, password } = req.body;

    if (!email) {
      return resp.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return resp.status(400).json({ error: 'Missing password' });
    }

    const existingUser = await dbClient.db.collection('users').findOne({ email });
    if (existingUser) {
      return resp.status(400).json({ error: 'Already exist' });
    }

    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
    const newUser = { email, password: hashedPassword };
    const addedUser = await dbClient.db.collection('users').insertOne(newUser);

    return resp.status(201).json({ id: addedUser.insertedId, email: newUser.email });
  },
  
  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const id = await redisClient.get(`auth_${token}`);
    if (!id) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const user = await dbClient.getUserById(id);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    res.json({ id: user._id, email: user.email }).end();
  }
};

export default UsersController;
