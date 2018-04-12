import SpotifyInterface from '../helpers/SpotifyInterface';
import MySQLInterface from '../helpers/MySQLInterface';

var spotifyInterface;
var mysqlInterface;


function _getPlaylistIds(userId) {
  return mysqlInterface.getUserSpotifyTokens(userId).then(data => {
    if (data[0]) {
      return new Promise((resolve, reject) => {
        spotifyInterface.getPlaylistIdsRecursive(data[0].accessToken, (err, data) => {
          resolve(data)
        })
      })
    } else {
      return Promise.reject('No user found')
    }
  })
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
    mysqlInterface = new MySQLInterface();
    spotifyInterface = new SpotifyInterface();
  }

  updatePlaylist(userId, callback) {
    new Promise((resolve, reject) => {
      _getPlaylistIds(userId)
        .catch(err => {
        	console.log(err)
          if (err.message === 'Unauthorized') {
            reject({unauthorized: true, error: err})
          } else {
            reject({unauthorized: false, error: err})
          }
        })
        .then(playlistIds => {
          resolve(playlistIds)
        })  
    })
    .then(playlistIds => {
      callback(null, playlistIds)
    })
    .catch(err => {
      if (err.unauthorized) {
        
      } else {
        callback(err, null)
      }
    })
    
  }
}

export default PlaylistArchiveService;

// offer a function that will try to update the playlist. If it errors for an Unauthorized
// refresh the token, and then try again. If it error for anything else, handle it like a
// normal error

/*const playlistArchiveService = new PlaylistArchiveService();
playlistArchiveService.updatePlaylist('andrewlloyd85', function(err, result) {
	if (err) {
		console.log(err)
	} else {
		console.log('playlistArchiveService result:', result)
	}
})*/
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