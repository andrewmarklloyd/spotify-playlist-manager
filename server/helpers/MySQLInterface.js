import * as mysql from 'mysql';
import config from '../../config/config';
import { encrypt, decrypt } from './Crypto';

const connection = mysql.createConnection({
  host     : config.mysql.host,
  user     : config.mysql.user,
  port     : config.mysql.port,
  password : config.mysql.password,
  database : config.mysql.database
});

class MySQLInterface {
  constructor() {
    connection.query('CREATE TABLE IF NOT EXISTS users (email VARCHAR(200) NOT NULL, userId VARCHAR(100) NOT NULL, accessToken TEXT NOT NULL, refreshToken TEXT NOT NULL, PRIMARY KEY (email, userId))', function (error, results, fields) {
        if (error) console.log(error);
    });
  }

  setUserSpotifyTokens(email, userId, accessToken, refreshToken) {
    return new Promise((resolve, reject) => {
      const userInfo = {email: email, userId: userId, accessToken: encrypt(accessToken), refreshToken: encrypt(refreshToken) };
      connection.query('REPLACE INTO users SET ?', userInfo, function (error, results, fields) {
        if (error) reject(error);
        resolve({userId, accessToken});
      });
    })
  }

  userExists(email) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
        if (error) reject(error);
        if (results[0]) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    })
  }

  getUserInfo(email, userId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
        if (error) reject(error);
        if (results[0]) {
          const tokenInfo = {};
          tokenInfo.accessToken = decrypt(results[0].accessToken);
          tokenInfo.refreshToken = decrypt(results[0].refreshToken);
          tokenInfo.userId = results[0].userId;
          tokenInfo.email = results[0].email;
          resolve(tokenInfo);
        } else {
          resolve(null);
        }
      });
    })
  }

  getUserPlaylist(email) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM userplaylist WHERE email = ?', [email], function (error, results, fields) {
        if (error) reject(error);
        if (results[0]) {
          resolve({userId: results[0].userId, playlistId: results[0].playlistId});
        } else {
          resolve(null);
        }
      });
    })
  }

  setReleaseDiscoveryPlaylist(userId, playlistId) {
    return new Promise((resolve, reject) => {
      const userInfo = { userId, playlistId };
      connection.query('REPLACE INTO userplaylist SET ?', userInfo, function (error, results, fields) {
        if (error) reject(error);
        resolve(userId);
      });
    })
  }

  getAllUserSpotifyTokens() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users', function (error, results, fields) {
        if (error) reject(error);
        resolve(results);
      });
    })
  }

  removeUserSpotifyTokens(userId) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM users WHERE userId = ?', [userId], function (error, results, fields) {
        if (error) reject(error);
        resolve(results);
      });
    })
  }
}

export default MySQLInterface;
