const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    this.client.on('error', (err) => {
      console.log('Redis client not connected to the server:', err);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(reply);
      });
    });
  }

  set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err, reply) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(reply);
      });
    });
  }

  del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(reply);
      });
    });
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;