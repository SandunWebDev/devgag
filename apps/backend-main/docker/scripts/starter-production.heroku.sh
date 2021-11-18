#!/usr/bin/env bash

set -e

# Sourcing ".bashrc" file so $PATH is updated and stuff. (Ex. asdf Loaded)
source /root/.bashrc

# Activating our virtual environment.
. .venv/bin/activate

# Creating Log Folder For SupervisorD Program's Logs
mkdir -p .logs

# Adding Enviroment Varaibles to Shell
export $(grep -v '^#' .env | xargs -d '\n')

# Dynamically filling nginx xonfig with PORT provided by Heroku.
sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/sites-available/default
sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/sites-enabled/backend-main.heroku.conf

cat /etc/nginx/sites-enabled/backend-main.heroku.conf

# Starting relevant programs mentioned in "./docker/supervisord/supervisord_programs" through superviosrd. (Ex. gunicorn, nginx)
supervisord -c /etc/supervisor/supervisord.conf


# Little explanation about how docker production build serve the content.
<<COMMENT
- Frontline for "UserRequest" are "NginX"
- If request is static file (http://abc.com/static/xxx), Its handled directly by NginX and send to the user. (Because NginX is very good with serving static contents.)
    - These are static files built by our WebPack Config on "backend-main/apps/frontend-assets/src" folder files and bundled into "backend-main/src/devgag_api/static/build". (Mainly CSS, Images & JS Functions)
    - Notice that this frontend file generating/serving is tightly coupled with Flask. (Mainly "templates" folders html files)

    - By the way, Know that we can decouple frontend from flask. (Like we are doing with ./apps/frontend-main)
        - So essentially for that flask is just API backend.
        - This gives us abilty to deploy frontend & backend seperatly and expand as needed.
        - Currently in this project we are doing both approch to check things out.
- If request is dynamic (Not Static), Its partially  handle by Ngix by "reverse_proxying" request to "Gunicorn" Server.
- Also both NginX and Gunicorn are handled by "Supervisord". It monitor and control a number of processes, auto restart, etc...
COMMENT
