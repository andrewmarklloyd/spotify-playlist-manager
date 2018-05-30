# Spotify Playlist Manager
<div>
  <a href="https://travis-ci.org/andrewmarklloyd/spotify-playlist-manager"><img src="https://travis-ci.org/andrewmarklloyd/spotify-playlist-manager.svg?branch=master"></img></a>
</div>

Web application to help Spotify users save songs from the Discover Weekly and Release Radar playlists.

Every Monday and Friday Spotify's algorithm builds personalized playlists for users. This application allows users to create an account and will cross references songs in these playlists against songs they've added to their library and adds them to a new playlist.

## Requirements
- Tested on Node.js 8 and npm 5
- MySQL 5.5

## Installation and Running
You can either run MySQL locally or using Docker.

If using Docker, start the database:
- `docker-compose -f test.docker-compose.yml up -d`
Install dependencies:
- `npm install`
Start the server and front-end
- `npm start`
