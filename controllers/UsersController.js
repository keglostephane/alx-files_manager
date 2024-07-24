const crypto = require('crypto');
const dbClient = require('../utils/db');

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
};

module.exports = UsersController;
