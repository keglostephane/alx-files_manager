const redisClient = require('../utils/redis')
const dbClient = require('../utils/db')

const AppController = {
  async getStatus(req, res) {
    try {
      const redisAlive = redisClient.isAlive();
      const dbAlive = dbClient.isAlive();

      if (redisAlive && dbAlive) {
        res.status(200).json({ redis: true, db: true });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getStat(req, res) {
    try {
      const numUsers = await dbClient.nbUsers();
      const numFiles = await dbClient.nbFiles();
      res.status(200).json({ users: numUsers, files: numFiles });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server  Error' });
    }
  },
};

module.exports = AppController
