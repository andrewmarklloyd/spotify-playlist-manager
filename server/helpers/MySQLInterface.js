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
  }

  setUserSpotifyTokens(userId, accessToken, refreshToken) {
    console.log(accessToken)
    console.log(encrypt(accessToken))
    return new Promise((resolve, reject) => {
      const userInfo = {userId: encrypt(userId), accessToken: encrypt(accessToken), refreshToken: encrypt(refreshToken) };
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
          resolve(results);
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