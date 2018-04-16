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
    connection.query('CREATE TABLE IF NOT EXISTS usertokens (userId VARCHAR(100) NOT NULL, email TEXT NOT NULL, accessToken TEXT NOT NULL, refreshToken TEXT NOT NULL, PRIMARY KEY (userId))', function (error, results, fields) {
        if (error) console.log(error);
    });
    connection.query('CREATE TABLE IF NOT EXISTS userplaylist (userId VARCHAR(100) NOT NULL, playlistId TEXT NOT NULL, FOREIGN KEY (userId) REFERENCES usertokens(userId) ON DELETE CASCADE, PRIMARY KEY (userId))', function (error, results, fields) {
        if (error) console.log(error);
    });
    // create a separate table for userId and playlistId
  }

  setUserSpotifyTokens(userId, accessToken, refreshToken) {
    return new Promise((resolve, reject) => {
      const userInfo = {userId: userId, accessToken: encrypt(accessToken), refreshToken: encrypt(refreshToken) };
      connection.query('REPLACE INTO usertokens SET ?', userInfo, function (error, results, fields) {
        if (error) reject(error);
        resolve(userId);
      });
    })
  }

  getUserSpotifyTokens(userId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM usertokens WHERE userId = ?', [userId], function (error, results, fields) {
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

  getUserPlaylist(userId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM userplaylist WHERE userId = ?', [userId], function (error, results, fields) {
        if (error) reject(error);
        if (results[0]) {
          const playlistInfo = {};
          console.log(results)
          resolve(playlistInfo);
        } else {
          resolve(null);
        }
      });
    })
  }

  setUserPlaylist(userId, playlistId) {
    return new Promise((resolve, reject) => {
      const userInfo = {userId, playlistId };
      connection.query('REPLACE INTO userplaylist SET ?', userInfo, function (error, results, fields) {
        if (error) reject(error);
        resolve(userId);
      });
    })
  }

  getAllUserSpotifyTokens() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM usertokens', function (error, results, fields) {
        if (error) reject(error);
        resolve(results);
      });
    })
  }

  removeUserSpotifyTokens(userId) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM usertokens WHERE userId = ?', [userId], function (error, results, fields) {
        if (error) reject(error);
        resolve(results);
      });
    })
  }
}

export default MySQLInterface;
