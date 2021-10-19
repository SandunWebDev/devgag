"""API Views."""

from flask import Blueprint, render_template, request, redirect, url_for, abort
from pathlib import Path

from markupsafe import escape


blueprint = Blueprint(
    "api", __name__, url_prefix="/api", static_folder="../../static"
)


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
