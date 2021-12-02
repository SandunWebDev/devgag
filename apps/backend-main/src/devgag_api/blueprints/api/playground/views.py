"""API User Views."""

from pathlib import Path

from flask import Blueprint, abort, redirect, render_template, request, url_for
from markupsafe import escape

from devgag_api.models import User

blueprint = Blueprint(
    "playground",
    __name__,
    url_prefix="/playground",
)


# NOTE : All Endpoints specified here for learning/experiment purposes only.


@blueprint.route("/")
def playground():
    """/playground."""

    return render_template(
        "api/playground.html",
        my_description="Easy way to explore API Endpoints.",
    )


# Simple route that
#   GET - return "given text" that repeated for "given no times".
#   POST - return given age, gender, school in a computed text.
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


# Having multiple endpoints names.
@blueprint.route("/namelist", methods=["GET"])
@blueprint.route("/userlist", methods=["GET"])
def name_list():
    return {"status": True, "names": ["Google", "Yahoo"]}


# Uploading a file.
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


# Redirection
@blueprint.route("/redirect_me", methods=["GET"])
def redirect_me():
    return redirect(url_for("api.hello", name="Sahan", no_of_times=3))


# Error Handling
@blueprint.route("/error_path", methods=["GET"])
def error_path():
    abort(400)


# Database Example
@blueprint.route("/db", methods=["GET"])
def database_check():
    my_user = User.query.filter_by(id=1).first()

    return my_user.email
