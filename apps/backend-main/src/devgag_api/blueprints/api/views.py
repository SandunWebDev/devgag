#  type: ignore

"""API Views."""

from pathlib import Path

from flask import Blueprint, abort, redirect, render_template, request, url_for
from markupsafe import escape

from devgag_api.blueprints.api.auth import views as auth_views
from devgag_api.blueprints.api.jokepost import views as jokepost_views
from devgag_api.blueprints.api.playground import views as playground_views
from devgag_api.blueprints.api.user import views as user_views
from devgag_api.flask_utils import api_error, api_res

blueprint = Blueprint(
    "api",
    __name__,
    url_prefix="/api",
)

# Registering Nested Blueprints
blueprint.register_blueprint(auth_views.blueprint)
blueprint.register_blueprint(user_views.blueprint)
blueprint.register_blueprint(jokepost_views.blueprint)
blueprint.register_blueprint(playground_views.blueprint)


@blueprint.route("/", methods=["GET", "POST"])
@blueprint.route("/check-server", methods=["GET", "POST"])
def name_list():
    return api_res("API Server is running.")
