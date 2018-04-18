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
  var token;
  mysqlInterface.getUserSpotifyTokens(req.body.userId)
    .then(tokenResult => {
      token = tokenResult;
      return new Promise((resolve, reject) => {
        playlistArchiveService.getPlaylists(req.body.userId, function(err, result) {
          if (err) {
            reject(err)
          } else {
            resolve(result);
          }
        })  
      })
    })
    .then(result => {
      if (result.releaseDiscovery) {
        return Promise.resolve({userId: req.body.userId, releaseDiscovery: result.releaseDiscovery, initialCreation: false});
      } else {
        return spotifyInterface.createAggregatePlaylist(req.body.userId, token.accessToken)
        .then(response => {
          return mysqlInterface.setReleaseDiscoveryPlaylist(req.body.userId, response.body.id)
          .then(result => {
            return Promise.resolve({userId: req.body.userId, releaseDiscovery: response.body.id, initialCreation: true});
          })
        })
      }
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      const apiError = new APIError(err);
      next(apiError);
    })
}

function getPlaylistId(req, res, next) {
  mysqlInterface.getUserPlaylist(req.query.userId)
    .then(result => {
      if (result) {
        res.json({initialCreation: false, userId: result.userId, releaseDiscovery: result.playlistId});
      } else {
        res.json({});
      }
    })
    .catch(err => {
      const apiError = new APIError(err);
      next(apiError);
    })
}


export default { getAuthUrl, exchangeCode, authenticateUser, createPlaylist, getPlaylistId };
