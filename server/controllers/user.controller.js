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

function me(req, res, next) {
  res.json({user: req.user});
}

export default {
  me
};
