#!/bin/bash

# This script is used to install other language realated scripts folder's dependencies. (Ex. NodeJs WebPack Builder)

# Sourcing "bashrc" to update things. (Ex. asdf)
source ~/.bashrc

# Insalling "nodejsRunner" script folder. (Simple NodeJs project to Just run any Nodejs related tools. Ex. pyright )
cd ./scripts/nodejsRunner
npm install

# A main NodeJS project that bundle "Frontend Assets" (CSS, JS, ...) through webpack. Eventually we will use these from Flask templates.
cd ../../apps/frontend-assets
npm install
