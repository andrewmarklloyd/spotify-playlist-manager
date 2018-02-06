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

  refreshAccessToken(refreshToken) {
    return new Promise((resolve, reject) => {
      spotifyApi.setRefreshToken(refreshToken);
      spotifyApi.refreshAccessToken()
      .then((data) => {
        resolve({
          accessToken: data.body.access_token,
          refreshToken: spotifyApi.getRefreshToken()
        })
      })  
    })
  }
}

export default SpotifyInterface;
/*

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
        } Promise.all(promises).then(values => {
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

*/