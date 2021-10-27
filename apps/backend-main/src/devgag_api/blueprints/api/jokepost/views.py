"""API JokePost Views."""

import mimetypes
import uuid
from datetime import datetime as dt
from pathlib import Path

from flask import Blueprint, current_app, request
from flask_jwt_extended import current_user, jwt_required
from marshmallow import EXCLUDE, ValidationError, validate

from devgag_api.flask_extensions import csrf_protect, db, marshmallow
from devgag_api.flask_utils import api_error, api_res
from devgag_api.models import JokePost, JokePostLike, User
from devgag_api.schemas import JokePostSchema

blueprint = Blueprint(
    "jokepost",
    __name__,
    url_prefix="/jokepost",
)


@blueprint.route("/add", methods=["POST"])
@csrf_protect.exempt
@jwt_required()
def add_jokepost():
    """Adding a JokePost."""

    # NOTE : Make sure data is sended as "multipart/form-data"
    #        For example in frontend "axios" library just send all data and files as "new Form()" data.

    # Parsing passed form-data into python dict.
    try:
        json_body = request.form.to_dict()
        meme_joke_image = request.files.to_dict().get("meme_joke_image")
    except Exception as err1:
        return api_error(
            400,
            "Provided data are invalid or incomplete.",
            err_meta=err1.messages,
            err_obj=err1,
        )

    # Just adding placeholder "meme_joke" value, if file is passed by user.
    # Because using "File Object (meme_joke_image)" for "meme_joke" value not possible, As our scheme expecting 'str' value and what we eventually save on db also "str" Path.
    # Essentially we are trying to check all necessary data are passed by user, according to schema.
    mod_json_body = {**json_body}
    if meme_joke_image:
        mod_json_body["meme_joke"] = "PLACEHOLDER"

    schema = JokePostSchema(
        unknown=EXCLUDE,
        only=[
            "type",
            "title",
            "description",
            "text_joke",
            "text_background",
            "meme_joke",
        ],
    )

    try:
        parsed_json_body = schema.load(mod_json_body)
    except ValidationError as err2:
        return api_error(
            400,
            "Provided data are invalid or incomplete.",
            err_meta=err2.messages,
            err_obj=err2,
        )

    try:
        # Handling spacial cases that applies to "MEME" type post.
        #   Such as fileType, fileSize, filePath, storage, etc...
        if parsed_json_body["type"] == "MEME":
            # Only allowing image files types.
            file_mimetype = mimetypes.guess_type(meme_joke_image.filename)[0]
            is_image_type = file_mimetype.startswith("image/")

            if not is_image_type:
                return api_error(400, "Invalid File Type.")

            # Only allowing  image file less than 1 MB.
            meme_joke_image.seek(0, 2)
            file_size = meme_joke_image.tell()  # In Bytes
            file_size_in_mb = file_size / (1024 * 1024)  # In in MBytes
            meme_joke_image.seek(0, 0)  # Reseeking to avoid corrupt file save.
            is_small_file = file_size_in_mb <= 1

            if not is_small_file:
                return api_error(400, "Large File Size.")

            # Getting base path, To specify where uploaded files will be saved.
            upload_storage_base_path = current_app.config[
                "UPLOAD_STORAGE_BASE_PATH"
            ]
            upload_storage_folder_name = current_app.config[
                "UPLOAD_STORAGE_FOLDER_NAME"
            ]
            meme_photo_storage_folder = "meme_posts"

            meme_photo_storage_path = (
                upload_storage_base_path
                + "/"
                + upload_storage_folder_name
                + "/"
                + meme_photo_storage_folder
            )

            # Creating a directory if not exist.
            Path(meme_photo_storage_path).mkdir(parents=True, exist_ok=True)

            # Saving the file.
            uuid_prefix = uuid.uuid1()
            original_file_name = meme_joke_image.filename
            save_file_name = str(uuid_prefix) + "__" + original_file_name
            meme_joke_image.save(f"{meme_photo_storage_path}/{save_file_name}")

            # Adding relative static path for uploaded image, Which will be stored in DB.
            parsed_json_body[
                "meme_joke"
            ] = f"{upload_storage_folder_name}/{meme_photo_storage_folder}/{save_file_name}"

        # Creating the JokePost.
        JokePost.create(**parsed_json_body, created_by=current_user.id)
    except Exception as err3:
        return api_error(
            400,
            "Error occurred while creating a post.",
            err_obj=err3,
        )

    return api_res("JokePost successfully created.")


@blueprint.route("/get", methods=["POST"])
@csrf_protect.exempt
@jwt_required()
def get_jokepost():
    """Getting a JokePost."""

    json_body = request.get_json(force=True, silent=True)

    # Schema to validate "Req." JSON body data.
    JsonBodySchema = marshmallow.Schema.from_dict(  # noqa: N806
        {
            "post_id": marshmallow.Int(required=True, allow_none=False),
        }
    )

    json_body_schema = JsonBodySchema(unknown=EXCLUDE)
    try:
        parsed_json_body = json_body_schema.load(json_body)
    except ValidationError as err:
        return api_error(
            400,
            "Provided data are invalid or incomplete.",
            err_meta=err.messages,
            err_obj=err,
        )

    try:
        post = JokePost.query.filter_by(id=parsed_json_body["post_id"]).first()
    except Exception as err2:
        return api_error(
            400,
            "Error occurred while getting a post.",
            err_obj=err2,
        )

    jokepost_schema = JokePostSchema()
    jokepost_data = jokepost_schema.dump(post)

    return api_res(
        res_desc="JokePost successfully loaded.",
        res_data=jokepost_data,
    )


@blueprint.route("/getall", methods=["POST"])
@csrf_protect.exempt
@jwt_required()
def get_all_jokeposts():
    """Getting all JokePosts."""

    json_body = request.get_json(force=True, silent=True)

    # Schema to validate "Req." JSON body data.
    JsonBodySchema = marshmallow.Schema.from_dict(  # noqa: N806
        {
            "page": marshmallow.Int(allow_none=False, load_default=1),
            "per_page": marshmallow.Int(allow_none=False, load_default=10),
            "start_date": marshmallow.DateTime(
                allow_none=False, load_default=dt.utcnow()
            ),  # This is needed to make sure page items are consistent, even new items being added later.
        }
    )

    json_body_schema = JsonBodySchema(unknown=EXCLUDE)
    try:
        parsed_json_body = json_body_schema.load(json_body)
    except ValidationError as err:
        return api_error(
            400,
            "Provided data are invalid or incomplete.",
            err_meta=err.messages,
            err_obj=err,
        )

    try:
        paginator = (
            JokePost.query.filter(
                JokePost.created_at <= parsed_json_body.get("start_date"),
            )
            .order_by(JokePost.created_at.desc())
            .paginate(
                page=parsed_json_body.get("page"),
                per_page=parsed_json_body.get("per_page"),
                error_out=False,
            )
        )
    except Exception as err2:
        return api_error(
            400,
            "Error occurred while getting posts.",
            err_obj=err2,
        )

    jokepost_schema = JokePostSchema(
        many=True, exclude=["populated__likeslist"]
    )
    jokepost_data = jokepost_schema.dump(paginator.items)

    return api_res(
        res_desc="JokePost successfully loaded.",
        res_data=jokepost_data,
        res_meta={
            "current_page": paginator.page,
            "total_pages": paginator.pages,
            "total_items": paginator.total,
        },
    )


@blueprint.route("/like", methods=["POST"])
@csrf_protect.exempt
@jwt_required()
def like_a_jokepost():
    """Adding a Like to JokePost."""

    json_body = request.get_json(force=True, silent=True)

    # Schema to validate "Req." JSON body data.
    JsonBodySchema = marshmallow.Schema.from_dict(  # noqa: N806
        {
            "post_id": marshmallow.Int(required=True, allow_none=False),
            "like": marshmallow.Int(
                required=True,
                allow_none=False,
                strict=True,
                validate=[
                    validate.OneOf([-1, 1]),
                ],
            ),
        }
    )

    json_body_schema = JsonBodySchema(unknown=EXCLUDE)
    try:
        parsed_json_body = json_body_schema.load(json_body)
    except ValidationError as err:
        return api_error(
            400,
            "Provided data are invalid or incomplete.",
            err_meta=err.messages,
            err_obj=err,
        )

    existing_like = JokePostLike.query.filter_by(
        jokepost_id=parsed_json_body.get("post_id"), user_id=current_user.id
    ).first()

    if existing_like:
        if existing_like.like == parsed_json_body.get("like"):
            return api_res(
                res_status="fail", res_desc="User already liked/disliked."
            )
        else:
            try:
                existing_like.update(
                    like=parsed_json_body.get("like"),
                )
            except Exception as err2:
                return api_error(
                    400,
                    "Error occurred while liking a post.",
                    err_obj=err2,
                )
    else:
        try:
            JokePostLike.create(
                jokepost_id=parsed_json_body.get("post_id"),
                user_id=current_user.id,
                like=parsed_json_body.get("like"),
            )
        except Exception as err3:
            return api_error(
                400,
                "Error occurred while liking a post.",
                err_obj=err3,
            )

    try:
        liked_post = JokePost.query.filter_by(
            id=parsed_json_body["post_id"]
        ).first()
    except Exception as err4:
        return api_error(
            400,
            "Error occurred while getting a post.",
            err_obj=err4,
        )

    jokepost_schema = JokePostSchema(exclude=["populated__likeslist"])
    jokepost_data = jokepost_schema.dump(liked_post)

    return api_res(
        jokepost_data, res_desc="Like status successfully updated on JokePost."
    )
