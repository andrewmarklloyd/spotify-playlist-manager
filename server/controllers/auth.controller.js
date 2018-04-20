import _ from 'lodash';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import Joi from 'joi';
import SpotifyWebApi from 'spotify-web-api-node';
import APIError from '../helpers/APIError';
import paramValidation from '../../config/param-validation';
import config from '../../config/config';
import MySQLInterface from '../helpers/MySQLInterface';
import SpotifyInterface from '../helpers/SpotifyInterface';
import PlaylistArchiveService from '../helpers/PlaylistArchiveService';

const mysqlInterface = new MySQLInterface();
const spotifyInterface = new SpotifyInterface();

const playlistArchiveService = new PlaylistArchiveService();


function login(req, res, next) {
  const { username } = req.body;
  const { password } = req.body;
  const user = {};
  const token = jwt.sign(user.toJSON(), config.jwtSecret, { expiresIn: '40000h' });

  return res.status(200).json({
    token
  });
}

function register(req, res, next) {
  const { email } = req.body;
  const { spotifyAuthCode } = req.body;

  var userId;
  var accessToken;
  var refreshToken;

  mysqlInterface.getUserSpotifyTokens(email)
    .then(userInfo => {
      if (userInfo && userInfo.email == email) {
        throw new Error('User already registered');
      } else {
        return spotifyInterface.exchangeAccessCodeForTokens(spotifyAuthCode);
      }
    })
    .then(response => {
      userId = response.body.userId;
      accessToken = response.body.access_token;
      refreshToken = response.body.refresh_token;
      return Promise.resolve();
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        spotifyInterface.getPlaylistIds(accessToken, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        })  
      })
    })
    .then(playlistIds => {
      if (playlistIds.releaseDiscovery) {
        return Promise.resolve(playlistIds.releaseDiscovery);
      } else {
        spotifyInterface.createAggregatePlaylist(userId, accessToken)
        .then(playlistResult => {
          console.log('playlistResult', playlistResult)
          return Promise.resolve(playlistResult.body.id);
        })
      }
    })
    .then(playlistId => {
      return mysqlInterface.setUserSpotifyTokens(email, userId, accessToken, refreshToken)
        .then(result => {
          console.log('playlistId', playlistId)
          return Promise.resolve(playlistId);
        })
    })
    .then(playlistId => {
      const user = { email, userId };
      const token = jwt.sign(user, config.jwtSecret, { expiresIn: '40000h' });
      return res.status(200).json({
        token,
        user,
        playlistId
      });
    })
    .catch(err => {
      const apiError = new APIError(err);
      next(apiError);
    })

  /*const user = {userId: 'andrewlloyd85'}
  const token = jwt.sign(user, config.jwtSecret, { expiresIn: '40000h' });
  res.status(201).json({
    user,
    token
  });*/
}

export default {
  login,
  register
};
