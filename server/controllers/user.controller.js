import Joi from 'joi';
import SpotifyWebApi from 'spotify-web-api-node';
import paramValidation from '../../config/param-validation';
import config from '../../config/config';
import APIError from '../helpers/APIError';
import MySQLInterface from '../helpers/MySQLInterface';
import SpotifyInterface from '../helpers/SpotifyInterface';
import PlaylistArchiveService from '../helpers/PlaylistArchiveService';

const mysqlInterface = new MySQLInterface();
const spotifyInterface = new SpotifyInterface();

const playlistArchiveService = new PlaylistArchiveService();

function getAuthUrl(req, res, next) {
  const authUrl = spotifyInterface.getAuthUrl();
  res.json({authUrl: authUrl})
}

function exchangeCode(req, res, next) {
  spotifyInterface.exchangeAccessCodeForTokens(req.body.spotifyAccessCode)
    .then(function(response) {
      return mysqlInterface.setUserSpotifyTokens(response.body.userId, response.body.access_token, response.body.refresh_token);
    })
    .then(userId => {
      res.json({userId});
    })
    .catch(err => {
      const apiError = new APIError(err);
      next(apiError);
    })
}

function authenticateUser(req, res, next) {
  mysqlInterface.getUserSpotifyTokens(req.body.userId)
    .then(result => {
      if (result) {
        res.json({authenticated: true, userId: result.userId, playlistId: result.playlistId});
      } else {
        res.json({authenticated: false});
      }
    })
}

function createPlaylist(req, res, next) {
  res.json({playlistId: '12345'})
}

function getPlaylistId(req, res, next) {
  res.json({playlistId: '12345'})
}


export default { getAuthUrl, exchangeCode, authenticateUser, createPlaylist, getPlaylistId };
