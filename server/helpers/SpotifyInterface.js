import SpotifyWebApi from 'spotify-web-api-node';
import uuid from 'uuid/v1';
import config from '../../config/config';

const scopes = ['user-read-private', 'user-read-email', 'playlist-read-private', 'user-library-read', 'playlist-modify-private', 'playlist-modify-public'];

var spotifyApi;


class SpotifyInterface {
  constructor() {
    spotifyApi = new SpotifyWebApi({
      redirectUri : config.spotify.redirectUri,
      clientId : config.spotify.clientId,
      clientSecret: config.spotify.clientSecret
    })    
  }

  getAuthUrl() {
    const state = uuid();
    return spotifyApi.createAuthorizeURL(scopes, state);
  }

  exchangeAccessCodeForTokens(accessCode) {
    return spotifyApi.authorizationCodeGrant(accessCode);
  }

  setAccessToken(accessToken) {
    return spotifyApi.authorizationCodeGrant(spotifyAccessCode);
  }
}

export default SpotifyInterface;
