#!/bin/bash

cd /home/deploy
docker-compose pull spotify-app
docker-compose restart spotify-app
