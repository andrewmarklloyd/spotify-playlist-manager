#!/bin/bash

cd /home/deploy
docker-compose pull spotify-app
docker-compose stop spotify-app
docker-compose rm -f spotify-app
docker-compose up -d
