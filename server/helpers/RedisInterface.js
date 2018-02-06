import * as redis from 'redis';
import config from '../../config/config';

const client = redis.createClient({
  host: 'localhost',
  port: '6379'
});

class RedisInterface {
  constructor() {
    client.on("error", function (err) {
      console.log("Error " + err);
    });

  }

  setUserSpotifyToken(userId, apiToken) {
    return new Promise((resolve, reject) => {
      client.set(userId, apiToken, function (err, reply) {
        if (err) {
          reject(err)
        } else {
          resolve(reply.toString());
        }
      });  
    })
  }

  getUserSpotifyToken(userId) {
    return new Promise((resolve, reject) => {
      client.get(userId, function (err, reply) {
        if (err) {
          reject(err)
        } else {
          resolve(reply.toString());
        }
      });  
    })
  }

  removeUserSpotifyToken(userId) {
    return new Promise((resolve, reject) => {
      client.del(userId, function(err, response) {
        if (response == 1) {
          resolve()
        } else {
          reject()
        }
      })
    })
  }
}

export default RedisInterface;
