#!/bin/bash

# Config
IMAGE_NAME="docker.io/tymblhubdev/tymblhub-fed:latest"
CONTAINER_NAME="tymbl-fed"
PORT=9085
INTERNAL_PORT=3000

echo "🔍 Checking if container $CONTAINER_NAME is running..."

# Stop and remove if container exists
if [ "$(docker ps -q -f name=^/${CONTAINER_NAME}$)" ]; then
  echo "🛑 Stopping running container: $CONTAINER_NAME"
  docker stop $CONTAINER_NAME
fi

if [ "$(docker ps -aq -f name=^/${CONTAINER_NAME}$)" ]; then
  echo "🧹 Removing old container: $CONTAINER_NAME"
  docker rm $CONTAINER_NAME
fi

# Pull the latest image
echo "📥 Pulling latest image: $IMAGE_NAME"
docker pull $IMAGE_NAME

# Run the container
echo "🚀 Starting new container: $CONTAINER_NAME on port $PORT"
docker run -d --name $CONTAINER_NAME -p $PORT:$INTERNAL_PORT $IMAGE_NAME

echo "✅ App is running at: http://localhost:$PORT"


