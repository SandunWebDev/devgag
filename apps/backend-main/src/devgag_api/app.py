"""Flask Main Entrypoint.

This app module, containing the app factory function, which wire all flask things with each other.
"""

import logging
import sys

from flask import Flask, render_template

from devgag_api import blueprints, flask_custom_commands
from devgag_api.flask_extensions import (
    bcrypt,
    cache,
    csrf_protect,
    db,
    debug_toolbar,
    flask_static_digest,
    login_manager,
    migrate,
)


def create_app(config_object="devgag_api.flask_settings"):
    """Create application factory.

    As explained here: http://flask.pocoo.org/docs/patterns/appfactories/.

    :param config_object: The configuration object to use.
    """

    app = Flask(__name__.split(".")[0])
    app.config.from_object(config_object)

    register_extensions(app)
    register_blueprints(app)
    register_errorhandlers(app)
    register_shellcontext(app)
    register_commands(app)
    configure_logger(app)

    return app


def register_extensions(app):
    """Register Flask extensions."""

    bcrypt.init_app(app)
    cache.init_app(app)
    db.init_app(app)
    csrf_protect.init_app(app)
    login_manager.init_app(app)
    debug_toolbar.init_app(app)
    migrate.init_app(app, db)
    flask_static_digest.init_app(app)


def register_blueprints(app):
    """Register Flask blueprints."""

    app.register_blueprint(blueprints.public.views.blueprint)
    app.register_blueprint(blueprints.user.views.blueprint)
    app.register_blueprint(blueprints.api.views.blueprint)


def register_errorhandlers(app):
    """Register error handlers."""

    def render_error(error):
        """Render error template."""
        # If a HTTPException, pull the `code` attribute; default to 500

        error_code = getattr(error, "code", 500)
        return render_template(f"{error_code}.html"), error_code

    for errcode in [401, 404, 500]:  # noqa: WPS335
        app.errorhandler(errcode)(render_error)


def register_shellcontext(app):
    """Register shell context objects."""

    def shell_context():
        """Shell context objects."""
        return {"db": db, "User": blueprints.user.models.User}

    app.shell_context_processor(shell_context)


def register_commands(app):
    """Register custom "Click" CLI commands with Flask CLI."""

    app.cli.add_command(flask_custom_commands.test)


def configure_logger(app):
    """Configure loggers."""

    handler = logging.StreamHandler(sys.stdout)
    if not app.logger.handlers:
        app.logger.addHandler(handler)
