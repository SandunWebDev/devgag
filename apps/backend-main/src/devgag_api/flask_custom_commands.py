"""Custom Flask CLI commands.

Custom "Click" CLI commands to be used with Flask CLI.
These commands can be run in "flask xxx" manner.

# SIDENOTE : Make sure to register these commands in "app.py". If not they are not available through "flask xxx" manner.

# SIDENOTE : Due to some custom livereload implementation on "autoapp.py", "flask xxx" wont run as intended.
#            So to resolve this make sure this env. variable "IS_CUSTOM_FLASK_CMD=True" is setted bedore running command.
"""

import os
from glob import glob

import click

HERE = os.path.abspath(os.path.dirname(__file__))
PROJECT_ROOT = os.path.join(HERE, "../../")
TEST_PATH = os.path.join(PROJECT_ROOT, "tests")


@click.command()
def test():
    """Run the tests."""
    import pytest

    rv = pytest.main([TEST_PATH, "--verbose"])
    exit(rv)


# Just a simple way to created database tables if they are not already exist.
#   (Only good as very initial step, Like very new database. Because schema changes, existing data migrate, etc.. not possible/happening in this.)
# So don't use this. Instead use "poetry run task db-migrate-apply" and relevant command.
# See "https://stackoverflow.com/questions/30425214/what-is-the-difference-between-creating-db-tables-using-alembic-and-defining-mod/30425438" for more info.
@click.command()
def initdb():
    """Intializing DB."""
    import os

    from devgag_api.app import create_app
    from devgag_api.flask_extensions import db

    with create_app().app_context():
        db.create_all()
