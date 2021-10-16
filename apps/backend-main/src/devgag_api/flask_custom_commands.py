"""Custom Flask CLI commands.

Custom "Click" CLI commands to be used with Flask CLI.
These commands can be run in "flask xxx" manner.
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
