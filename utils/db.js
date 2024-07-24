const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    this.db = null;

    this.client.connect((err) => {
      if (err) {
        console.error('Error connecting to MongoDB:', err);
      } else {
        console.log('Connected successfully to MongoDB');
        this.db = this.client.db(database);
      }
    });
  }

  isAlive() {
    return !!this.client && !!this.client.topology && this.client.topology.isConnected();
  }

  async nbUsers() {
    try {
      const count = await this.db.collection('users').countDocuments();
      return count;
    } catch (err) {
      console.error('Error counting documents in "users" collection:', err);
      return -1;
    }
  }

  async nbFiles() {
    try {
      const count = await this.db.collection('files').countDocuments();
      return count;
    } catch (err) {
      console.error('Error counting documents in "files" collection:', err);
      return -1;
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
