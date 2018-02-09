import RedisInterface from '../helpers/RedisInterface';
import SpotifyInterface from '../helpers/SpotifyInterface';

var redisInterface;
var spotifyInterface;



function _updatePlaylist(userId) {

}

/*
  The token has expired, refresh the token, return the new accessToken
*/
function _handleUnauthorized(refreshToken) {

}

function _handleOtherErrors(error) {

}



class PlaylistArchiveService {
  constructor() {
    redisInterface = new RedisInterface();
    spotifyInterface = new SpotifyInterface();
  }

  updatePlaylist(userId) {
    redisInterface.getUserSpotifyTokens('andrew85.lloyd@gmail.com')
      .then(tokens => {
        return new Promise((resolve, reject) => {
          spotifyInterface.getPlaylistIds(tokens.accessToken)
          .catch(err => {
            if (err.message === 'Unauthorized') {
              reject({retry: true})
            } else {
              reject({retry: false})
            }
          })
          .then(playlistIds => {
            resolve(playlistIds)
          })
        })
        .then(d => {
          console.log(d)
        })
        .catch(e => {
          console.log(e)
        })
      })
  }
}

export default PlaylistArchiveService;

// offer a function that will try to update the playlist. If it errors for an Unauthorized
// refresh the token, and then try again. If it error for anything else, handle it like a
// normal error

const playlistArchiveService = new PlaylistArchiveService();
playlistArchiveService.updatePlaylist()
/*function refreshToken(userId) {
  redisInterface.getUserSpotifyTokens(userId)
  .then(tokens => {
    return spotifyInterface.refreshAccessToken(tokens.refreshToken)
  })
  .then(function(newTokens) {
    redisInterface.setUserSpotifyTokens(userId, newTokens.accessToken, newTokens.refreshToken)
  })
  .catch(err => {
    console.log(err)
  })
}

function test() {
  redisInterface.getUserSpotifyTokens('andrew85.lloyd@gmail.com')
  .then(tokens => {
    spotifyInterface.updatePlaylistIds(tokens.accessToken)
  })
}*/