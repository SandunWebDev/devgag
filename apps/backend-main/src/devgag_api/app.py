"""Flask Main Entrypoint.

This app module, containing the app factory function, which wire all flask things with each other.
"""

import logging
import sys

from flask import Flask, json, render_template, request
from werkzeug.exceptions import HTTPException

from devgag_api import blueprints, flask_custom_commands
from devgag_api.flask_extensions import (  # noqa: WPS235
    bcrypt,
    cache,
    cors,
    csrf_protect,
    db,
    debug_toolbar,
    flask_static_digest,
    jwt,
    login_manager,
    marshmallow,
    migrate,
)
from devgag_api.flask_utils import api_error, api_res


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
    login_manager.init_app(app)
    debug_toolbar.init_app(app)
    migrate.init_app(app, db)
    flask_static_digest.init_app(app)
    cors.init_app(app)
    jwt.init_app(app)

    csrf_protect.init_app(app)
    # Diasbling CSRF only for "/api/xxx" endpoint paths.
    # SIDENOTE : But currently for nested blueprints this doesn't work. (Ex. devgag_api/api/auth/views Blueprint)
    #            So for now we are manually "CSRF Exclude" each route on those files using "@csrf_protect.exempt" decorater.
    csrf_protect.exempt(
        blueprints.api.views.blueprint,
    )

    # SIDENOTE : Order matters. Make sure to initialize "SQLAlchemy" before "Marshmallow".
    marshmallow.init_app(app)


def register_blueprints(app):
    """Register Flask blueprints."""

    app.register_blueprint(blueprints.public.views.blueprint)
    app.register_blueprint(blueprints.user.views.blueprint)
    app.register_blueprint(blueprints.api.views.blueprint)


def register_errorhandlers(app):
    """Register error handlers."""

    def generic_error_handler(e):
        error_occurred_path = request.path
        is_development = app.config["ENV"] == "development"

        if is_development:
            print("ERROR OCCURRED :", repr(e), file=sys.stderr)

        # Generically clearing any db errors.
        # Came to here mean if any database error happened, its was not handled their. So in here we clear them so any future db request don't fail just because db error "rollback" didn't happen.
        db.session.rollback()

        # Trying to extract error code. If not possible (For example "Syntax Error in Code itself"), default to 500
        error_code = getattr(e, "code", 500)

        if error_occurred_path.startswith("/api/"):
            # Handle exceptions as JSON.
            # Handling error occurred in "/api/xxx" endpoints, by sending error as JSON response.
            # Because those are mostly consumed by third party and they can easily handle errors on "their end" using JSON error.
            return api_error(err_obj=e)
        else:
            # Handle exceptions as web pages.
            # Handling error occurred in other endpoints, by showing custom error page.
            return render_template(f"{error_code}.html"), error_code

    app.errorhandler(Exception)(generic_error_handler)


def register_shellcontext(app):
    """Register shell context objects."""

    def shell_context():
        """Shell context objects."""
        return {"db": db, "User": blueprints.user.models.User}

    app.shell_context_processor(shell_context)


def register_commands(app):
    """Register custom "Click" CLI commands with Flask CLI."""

    app.cli.add_command(flask_custom_commands.test)
    app.cli.add_command(flask_custom_commands.initdb)


def configure_logger(app):
    """Configure loggers."""

    handler = logging.StreamHandler(sys.stdout)
    if not app.logger.handlers:
        app.logger.addHandler(handler)
