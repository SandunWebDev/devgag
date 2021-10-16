#!/bin/bash

# This script is used to install other language realated scripts folder's dependencies. (Ex. NodeJs WebPack Builder)

# Sourcing "bashrc" to update things. (Ex. asdf)
source ~/.bashrc

# Installing NodeJS Dependecies needed for frontend build stuff. (Webpack, Etc...)
npm install

# Insalling "nodejsRunner" script folder.
cd ./scripts/nodejsRunner
npm install
