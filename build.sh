#!/bin/bash

set -e  # Exit immediately if a command fails
npm install next react react-dom
DOCKER_HUB_USERNAME="tymblhubdev"
IMAGE_NAME="tymblhub-fed"

# Step 1: Get latest Git tag
GIT_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "latest")
FULL_IMAGE_TAG="$DOCKER_HUB_USERNAME/$IMAGE_NAME:$GIT_TAG"
LATEST_TAG="$DOCKER_HUB_USERNAME/$IMAGE_NAME:latest"

echo "🛠 Using Git tag: $GIT_TAG"

# Step 2: Build your app
npm run build

# Step 3: Docker login
docker login || { echo "❌ Docker login failed!"; exit 1; }

# Step 4: Build the Docker image
#docker build -t "$FULL_IMAGE_TAG" -t "$LATEST_TAG" .


if [ "$1" = "ec2" ]; then
  echo "🛠 Building for EC2 (amd64 platform)..."
  docker build --platform=linux/amd64 -t "$FULL_IMAGE_TAG" -t "$LATEST_TAG" .
else
  echo "🛠 Building with default platform..."
  docker build -t "$FULL_IMAGE_TAG" -t "$LATEST_TAG" .
fi

# Step 5: Push both versioned and latest tags
docker push "$FULL_IMAGE_TAG"
docker push "$LATEST_TAG"

echo "✅ Docker image pushed:"
echo "   - $FULL_IMAGE_TAG"
echo "   - $LATEST_TAG"

