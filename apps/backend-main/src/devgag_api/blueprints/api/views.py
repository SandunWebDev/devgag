#  type: ignore

"""API Views."""

from pathlib import Path

from flask import Blueprint, abort, redirect, render_template, request, url_for
from markupsafe import escape

from devgag_api.blueprints.api.auth import views as auth_views
from devgag_api.blueprints.api.jokepost import views as jokepost_views
from devgag_api.blueprints.api.user import views as user_views

blueprint = Blueprint(
    "api",
    __name__,
    url_prefix="/api",
)

# Registering Nested Blueprints
blueprint.register_blueprint(auth_views.blueprint)
blueprint.register_blueprint(user_views.blueprint)
blueprint.register_blueprint(jokepost_views.blueprint)


@blueprint.route("/playground")
def playground():
    """/playground."""

    return render_template(
        "api/playground.html",
        my_description="Easy way to explore API Endpoints.",
    )


@blueprint.route(
    "/hello/<string:name>/<int:no_of_times>", methods=["GET", "POST"]
)
def hello(name, no_of_times):
    """/api/hello."""
    if request.method == "POST":
        # Accessing Data Sended in Body.
        age = request.form["age"]
        gender = request.form["gender"]

        # Accessing Data Sended as Query Params.
        school = request.args.get("school", "NO SCHOOL")

        return f"Hi, {name}, Your age is {age} and gender is {gender}. Your school is {school}"
    else:
        return f"<h1>Hello {escape(name) * no_of_times }</h1>"


@blueprint.route("/namelist", methods=["GET"])
@blueprint.route("/userlist", methods=["GET"])
def name_list():
    return {"status": True, "names": ["Sandun", "Sahan"]}


@blueprint.route("/upload", methods=["POST"])
def upload_file():
    # NOTE : Make sure data is sended as enctype="multipart/form-data"

    if request.method == "POST":
        file = request.files["myfile"]

        # Creating a directory if not exist.
        Path("./database/uploaded_files").mkdir(parents=True, exist_ok=True)

        # Saving the file.
        original_file_name = file.filename
        file.save(f"./database/uploaded_files/{original_file_name}")

        return "<h1>Successfully Uploaded</h1>"


@blueprint.route("/redirect_me", methods=["GET"])
def redirect_me():
    return redirect(url_for("api.hello", name="Sahan", no_of_times=3))


@blueprint.route("/error_path", methods=["GET"])
def error_path():
    abort(400)


# @blueprint.route("/db", methods=["GET"])
# def database_check():
#     myUser = User.query.filter_by(username="abc").first()

#     return myUser.email


@blueprint.route(
    "/temp/<string:name>/<int:no_of_times>", methods=["GET", "POST"]
)
def hellox(name, no_of_times):
    # raise Exception("YYY")

    # json_body = request.get_json(force=True, silent=True)
    json_body = request.get_json(
        force=True,
    )

    if json_body is None:
        return "Failed"
    else:
        return json_body
