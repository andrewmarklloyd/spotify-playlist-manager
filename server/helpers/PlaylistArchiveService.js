import RedisInterface from '../helpers/RedisInterface';
import SpotifyInterface from '../helpers/SpotifyInterface';

var redisInterface;
var spotifyInterface;

class PlaylistArchiveService {
  constructor() {
    redisInterface = new RedisInterface();
    spotifyInterface = new SpotifyInterface();
  }

  tryUpdatePlaylist(userId) {
    redisInterface.getUserSpotifyTokens('andrew85.lloyd@gmail.com')
      .then(tokens => {
        spotifyInterface.getPlaylistIds(tokens.accessToken.replace('a','b'))
        .catch(err => {
          if (err.message === 'Unauthorized') {
            
          }
        })
      })
      .then(playlistIds => {
        console.log('playlistIDs', playlistIds)
      })

  }
}

export default PlaylistArchiveService;

const playlistArchiveService = new PlaylistArchiveService();
playlistArchiveService.tryUpdatePlaylist()
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