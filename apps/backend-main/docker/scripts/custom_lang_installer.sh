#!/bin/bash

# In this script we install, Other programming langauge we need in docker image for custom development task.
#   - Ex. Need NodeJs to run "NodeMon" package which enable "Live Development Server"
# To handle installations of languages, We use "asdf" package manager.

# --- Functions

# Check if command exists on system.
is_installed() {
    command -v "$1" >/dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        return 1
    else
        return 0
    fi
}

# --------------------- Installing ASDF Package Manager --------------------
# Installing Git. (If not already avaialble.)
if is_installed git
then
   echo "Git Exist"
else
   apt-get -y update && apt-get -y install git
fi

# System Dependecies Needed for "asdf" and "plugins"
apt-get -y install dirmngr gpg curl gawk

# Downloading ASDF
git clone https://github.com/asdf-vm/asdf.git ~/.asdf

# Appending to ".bashrc" file and re-loading it.
echo ". ~/.asdf/asdf.sh" >> ~/.bashrc
source ~/.bashrc

# --------------------- Installing Lanaguages --------------------
# Installing NodeJS Latest Version.
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf install nodejs 16.10.0
asdf global nodejs 16.10.0

# NOTE : This mostly installed to temporally resolve below issue.
#        Which is "npm run xxx" don't work, when we dynamically mount our source code folder in docker-compose. (See docker-compose.development "volumes" section) Due to permission/ownership issue.
#        So in "starter-development.sh" and other relevent files use "yarn run xxx" instead.
npm i -g yarn
