#!/bin/bash

# This file define what should be executed when docker "development" container is started by deafult.

# SIDE NOTE : "npm run xxx" don't work currently. See "docker-compose.development.yml" volume section for more info.

# Starting WebPack Build Process and Developemnt Flask Server
# Below is "Yarn" eqvalent to "npm run start OR poetry run task dev"
yarn run concurrently -n "WEBPACK,FLASK" -c "bgBlue.bold,bgMagenta.bold" "yarn run webpack-watch" "yarn run flask-server"
