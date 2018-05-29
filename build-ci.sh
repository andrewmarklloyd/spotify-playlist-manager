#!/bin/bash

function buildApiImage {
	echo 'Building API Docker image'
	IMAGE="andrewlloyd/spotify-playlist-app"

	npm run build

	docker build -t $IMAGE .

	# must be part the organization
	echo $DOCKER_PASSWORD | docker login -u "$DOCKER_USERNAME" --password-stdin

	docker push $IMAGE
}

buildApiImage
