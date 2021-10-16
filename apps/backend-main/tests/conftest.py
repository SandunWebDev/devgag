"""Defines fixtures available to all tests."""

import logging

import pytest
from webtest import TestApp

from devgag_api.app import create_app
from devgag_api.database import db as _db
from tests.factories import UserFactory


@pytest.fixture
def app():
    """Create application for the tests."""
    _app = create_app("tests.flask_test_settings")  # noqa: WPS122
    _app.logger.setLevel(logging.CRITICAL)  # noqa: WPS121
    ctx = _app.test_request_context()  # noqa: WPS121
    ctx.push()

    yield _app  # noqa: WPS121

    ctx.pop()


@pytest.fixture
def testapp(app):
    """Create Webtest app."""
    return TestApp(app)


@pytest.fixture
def db(app):
    """Create database for the tests."""
    _db.app = app
    with app.app_context():
        _db.create_all()

    yield _db

    # Explicitly close DB connection
    _db.session.close()
    _db.drop_all()


@pytest.fixture
def user(db):
    """Create user for the tests."""
    user = UserFactory(password="supersecret")
    db.session.commit()
    return user
