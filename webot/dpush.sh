#!/bin/bash
### A SIMPLE DOCKER PUSH SCRIPT
# 
# Author: Co van Leeuwen (github.com/c00)
# Version: 1.0
#
# This script builds and tags a new version of a docker image, and then pushes
# the the image to a registry.
# 
# I'm assuming your version is in package.json, and you're using semver (or at least its format)

### VARIABLES / DEFAULTS ###
# Remote name
REGISTRY=crispyduck
# Image name
NAME=deadbolt

#Don't touch anything below here
set -e

# Function to replace text in files.
replace() 
{
	# Takes 'filename', 'search_for', 'replace_with'
	ESC2="$(echo "$2" | sed 's/[^-A-Za-z0-9_]/\\&/g')"
	ESC3="$(echo "$3" | sed 's/[^-A-Za-z0-9_]/\\&/g')"
	sed -i $1 -e "s/${ESC2}/${ESC3}/g"
}

# Get version from package.json
VERSION=$(cat package.json|jq -r '.version')
[ "$VERSION" = "null" ] && VERSION=0.0.0

# Increase version by 1
IFS='.'
read -ra PARTS <<< "$VERSION" 
PATCH=$((${PARTS[2]} + 1))
VERSION="${PARTS[0]}.${PARTS[1]}.$PATCH"
IFS=' '

echo "Creating Docker image: [$NAME]"
echo -n "New version number: [$VERSION] "
read USER_VERSION

[ -n "$USER_VERSION" ] && VERSION=$USER_VERSION

# Replace version in package.json
echo "Updating package.json..."
cp package.json package.json.bak
cat package.json | jq ".version = \"$VERSION\"" > __tmp_package.json && mv __tmp_package.json package.json

# Replace version in Dockerfile
echo "Updating Dockerfile..."
OLD_LABEL=$(cat Dockerfile|grep "LABEL version=")
NEW_LABEL="LABEL version=\"$VERSION\""
replace Dockerfile "$OLD_LABEL" "$NEW_LABEL"

# Build it.
echo "Building Docker image: $NAME:$VERSION..."
docker build . -t "$NAME:$VERSION" -t "$REGISTRY/$NAME:$VERSION" -t "$NAME:latest" -t "$REGISTRY/$NAME:latest"
echo "Pushing $REGISTRY/$NAME:$VERSION..."
docker push $REGISTRY/$NAME:$VERSION

echo "Done!"
