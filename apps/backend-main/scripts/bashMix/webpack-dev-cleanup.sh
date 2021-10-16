#!/usr/bin/env bash

# Helper script to remove existing "Build Folder" (backend-main/src/devgag_api/static/build) and Its "Manifest File" (cache_manifest.json)
# This is done to remove conflicts with existing frontend build artifacts (Witch is created from backend-main/assets), in Development Enviroment.
#     - Beacuse when "cache_manifest.json" (From "flask-static-digest") exist Jinga Templates uses files mentioned in that file. Not webpack development build files.

pwd

rm -f -r ./src/devgag_api/static/build
rm -f ./src/devgag_api/static/cache_manifest.json
