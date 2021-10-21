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

    is_development = app.config["ENV"] == "development"

    def handle_exception_as_json(e):
        """Return JSON instead of HTML Page for errors."""

        if is_development:
            print("ERROR : ", e, file=sys.stderr)

        # Trying to extract error code. If not possible (For example "Syntax Error in Code itself"), default to 500
        error_code = getattr(e, "code", 500)

        # When "e.get_response() / e.code / Etc..." is possible. (Mostly Syntax Error in Code itself.)
        if error_code == 500:
            return api_error(
                error_code, "Server Error", err_desc="Server Error Occurred."
            )

        return api_error(
            e.code,
            err_msg=e.name,
            err_desc=e.description,
        )

    def render_error_page(e):
        """Render Custom Error Page."""

        if is_development:
            print("ERROR : ", e, file=sys.stderr)

        # Trying to extract error code. If not possible (For example syntax error in code itself. EXCEPTION), default to 500
        error_code = getattr(e, "code", 500)

        # Special custom handling for 'api/xxx" endpoints. (Returning JSON error instead of page.)
        error_occurred_path = request.path
        if error_occurred_path.startswith("/api/"):
            return handle_exception_as_json(e)

        return render_template(f"{error_code}.html"), error_code

    # Handling HTTP related exceptions by returning error as JSON response. (Ex. When request body don't have necessary params)
    # This is mostly applicable to "/api/xxx" endpoints, Because those are mostly consume by third party and they can easily handle errors on "their end" using JSON error.
    app.errorhandler(HTTPException)(handle_exception_as_json)

    # Handling specific errors with "Custom Error Pages". But note that in "render_error_page" function we customize it for "/api/xxx" path to send "JSON Error" instead of page.
    for errcode in [401, 404, 500]:  # noqa: WPS335
        app.errorhandler(errcode)(render_error_page)

    # Any other error that still not catch. (Mostly Syntax Error in Code itself.)
    app.errorhandler(Exception)(render_error_page)


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
