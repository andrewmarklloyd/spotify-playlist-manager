import Joi from 'joi';
import paramValidation from '../../config/param-validation';
import APIError from '../helpers/APIError';

function authUrl(req, res, next) {
  res.json({url: 'http://spotify.com'})
}

export default { authUrl };
/*
var fs = require('fs');

var SpotifyWebApi = require('spotify-web-api-node');
var credentials = require('./config/client_secrets');
var spotifyApi = new SpotifyWebApi(credentials);

var tokens = require('./config/token.json');
var spotify_ids = require('./config/spotify_ids.json');

spotifyApi.setAccessToken(tokens.access_token);
spotifyApi.setRefreshToken(tokens.refresh_token);

function updatePlaylistIds() {
  spotifyApi.getUserPlaylists()
  .then(function(data) {
    for (var d in data.body.items) {
      switch (data.body.items[d].name) {
        case 'Release Radar':
          spotify_ids.playlist.release_radar = data.body.items[d].id;
          break;
        case 'Discover Weekly':
          spotify_ids.playlist.spotifydiscover = data.body.items[d].id;
          break;
      }
    }
    fs.writeFile(__dirname + '/config/spotify_ids.json', JSON.stringify(spotify_ids), function(err, data) {
      if (err) {console.log('Error writing playlist ids to file:', err);}
    });
  },function(err) {
    console.log('Something went wrong!', err);
  });
}

function containsMySavedTracks(list) {
  spotifyApi.containsMySavedTracks(list)
  .then(function(data) {

    // An array is returned, where the first element corresponds to the first track ID in the query
    //console.log(data.body);
    var trackIsInYourMusic = data.body[0];

    if (trackIsInYourMusic) {
      console.log('Track was found in the user\'s Your Music library');
    } else {
      console.log('Track was not found.');
    }
}, function(err) {
  console.log('Something went wrong!', err);
});

}

function getTokens() {
  return JSON.parse(fs.readFileSync('./config/token.json', 'utf-8'));
}

function storeTokens(access, refresh, callback) {
  fs.writeFile(__dirname + '/config/token.json', JSON.stringify({access_token: access, refresh_token: refresh}), function(err, data) {
    if (err) {console.log('Error writing token to file:', err);}
    if (callback) {
      callback();
    }
  });
}

function refreshToken(callback) {
  // clientId, clientSecret and refreshToken has been set on the api object previous to this call.
  spotifyApi.refreshAccessToken()
  .then(function(data) {
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
      storeTokens(data.body['access_token'], spotifyApi.getRefreshToken(), callback);
    }, function(err) {
      console.log('Could not refresh access token', err);
    });
}

function getAuthUrl() {
  redirectUri = credentials.redirectUri,
  clientId = credentials.clientId,
  state = '',
  scopes = ['user-read-private', 'user-read-email', 'playlist-read-private', 'user-library-read', 'playlist-modify-private', 'playlist-modify-public'];

  var spotifyApi = new SpotifyWebApi({
    redirectUri : redirectUri,
    clientId : clientId
  });

  var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  //console.log(authorizeURL);
  return authorizeURL;
}


function getAccessToken(code) { 

  // Retrieve an access token and a refresh token
  spotifyApi.authorizationCodeGrant(code)
  .then(function(data) {
    //console.log('The token expires in ' + data.body['expires_in']);
    //console.log('The access token is ' + data.body['access_token']);
    //console.log('The refresh token is ' + data.body['refresh_token']);
    storeTokens(data.body['access_token'], data.body['refresh_token']);
      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

function getMySavedTracks() {
  spotifyApi.getMySavedTracks().then(function(data) {
    console.log('Done!', data);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

function addTracksToPlaylist(playlist, tracks) {
  spotifyApi.addTracksToPlaylist(spotify_ids.user.me, playlist, tracks)
  .then(function(data) {

  }, function(err) {
    console.log('Error adding tracks to playlist:', err);
  });
}

function checkAndAddTracks(userId, playlistId) {
  spotifyApi.getPlaylist(userId, playlistId)
  .then(function(data) {
    
    var list = [];
    data.body.tracks.items.map(function(item) {
      if (item.track) {
        list.push(item.track.id);
      }
    });
    return list;
  }).then(function(list) {
    var items = list;
      //console.log(items);
      spotifyApi.containsMySavedTracks(list)
      .then(function(data) {
      // An array is returned, where the first element corresponds to the first track ID in the query
      var tracksToAdd = []
      for (var i in data.body) {
        if (data.body[i]) {
          tracksToAdd.push(items[i]);
        }
      }
      return tracksToAdd;
  }).then(function(tracksToAdd) {
      //filter out tracks already in playlist; use pagination on results
      var botTracks = [];
      spotifyApi.getPlaylistTracks(spotify_ids.user.me, spotify_ids.playlist.botdiscover, {limit: 100, offset: 0})
      .then(function(data){
        //console.log(data.body);
        botTracks = botTracks.concat(data.body.items);
        var promises = [];
        var calls = Math.ceil(data.body.total / 100);
        for (var i = 1; i < calls; i++) {
          var promise = new Promise((resolve, reject) => {
            spotifyApi.getPlaylistTracks(spotify_ids.user.me, spotify_ids.playlist.botdiscover, {limit: 100, offset: i * 100})
            .then(function(data){
              resolve(data.body.items);
            });
          });
          promises.push(promise);
        }
        Promise.all(promises).then(values => {
          values.forEach(function(item) {
            botTracks = botTracks.concat(item);
          });
          //all tracks are here now
          botTracks.map(function(item) {
            var index = tracksToAdd.indexOf(item.track.id);
            if (index > -1) {
              tracksToAdd.splice(index, 1);
            }
          });
          if (tracksToAdd.length > 0) {
            for (var i in tracksToAdd) {
              tracksToAdd[i] = 'spotify:track:' + tracksToAdd[i];
            }
            addTracksToPlaylist(spotify_ids.playlist.botdiscover, tracksToAdd);
          }
        }, reason => {
          console.log('FAILED', reason);
        });
      });
  });
}).catch(function(err) {
  console.log('Spotify API error on playlist ' + playlistId, err);
});
}

module.exports = {
  getAuthUrl: function() {
    return getAuthUrl();
  },
  getAccessToken: function(code) {
    getAccessToken(code);
  },
  refreshToken: function(callback){
    refreshToken(callback);
  }
}

if (process.argv[2]) {
  switch (process.argv[2]) {
    case '--auth':
    getAuthUrl();   
    break;
    case '--token':
    getAccessToken(process.argv[3]);
    break;
    case '--add-tracks':
    checkAndAddTracks(spotify_ids.user.spotify, spotify_ids.playlist.spotifydiscover);
    checkAndAddTracks(spotify_ids.user.spotify, spotify_ids.playlist.release_radar);
    break;
    case '--refresh-token':
    refreshToken();
    break;
  }
}
setInterval(refreshToken, 50 * 60 * 1000, function(){});
setInterval(updatePlaylistIds, 4 * 1 * 60 * 1000);
setInterval(function() {
   //console.log('Updating playlist');
   checkAndAddTracks(spotify_ids.user.spotify, spotify_ids.playlist.spotifydiscover);
   checkAndAddTracks(spotify_ids.user.spotify, spotify_ids.playlist.release_radar);
 }, 20 * 60 * 1000);
//checkAndAddTracks(spotify_ids.user.spotify, spotify_ids.playlist.spotifydiscover);
//checkAndAddTracks(spotify_ids.user.spotify, spotify_ids.playlist.release_radar);

*/