#!/usr/bin/env bash
set -e

# Sourcing ".bashrc" file so $PATH is updated and stuff. (Ex. asdf Loaded)
source ~/.bashrc

# Activating our virtual environment.
. .venv/bin/activate

# Creating Log Folder For SupervisorD Program's Logs
mkdir -p .logs

# You can put other setup logic here. (If applicable)
echo "-------------------------------------------------------------------------------------------------------------"
echo "# Starting Container"
echo "  Executing $0 $@"
echo "-------------------------------------------------------------------------------------------------------------"
echo ""

exec "$@"
