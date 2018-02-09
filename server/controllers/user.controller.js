import Joi from 'joi';
import SpotifyWebApi from 'spotify-web-api-node';
import paramValidation from '../../config/param-validation';
import config from '../../config/config';
import APIError from '../helpers/APIError';
import RedisInterface from '../helpers/RedisInterface';
import SpotifyInterface from '../helpers/SpotifyInterface';
import PlaylistArchiveService from '../helpers/PlaylistArchiveService';

const redisInterface = new RedisInterface();
const spotifyInterface = new SpotifyInterface();

function getAuthUrl(req, res, next) {
  const authUrl = spotifyInterface.getAuthUrl();
  res.json({authUrl: authUrl})
}

function exchangeCode(req, res, next) {
  var userId = req.body.userId;

  spotifyInterface.exchangeAccessCodeForTokens(req.body.spotifyAccessCode)
    .then(function(response) {
      return redisInterface.setUserSpotifyTokens(req.body.userId, response.body.access_token, response.body.refresh_token);
    })
    .then(result => {
      res.json({result: 'OK'})
    })
    .catch(err => {
      res.json({result: err})
    })
}

export default { getAuthUrl, exchangeCode };
