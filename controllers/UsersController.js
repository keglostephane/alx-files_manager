const crypto = require('crypto');
const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const UsersController = {
  async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    const usersCollection = dbClient.db.collection('users');

    try {
      const user = await usersCollection.findOne({ email });
      if (user) {
        return res.status(400).json({ error: 'Already exist' });
      }

      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
      const newUser = { email, password: hashedPassword };
      const registredUser = await usersCollection.insertOne(newUser);

      return res.status(201).json({ id: registredUser.insertedId, email: newUser.email });
    } catch (error) {
      console.error('Error registring user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getMe(req, res) {
    const token = req.headers['x-token'];
    console.log(token);

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ id: user._id, email: user.email });
  },
};

module.exports = UsersController;
