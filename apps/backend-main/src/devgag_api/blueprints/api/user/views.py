"""API User Views."""

from flask import Blueprint, request
from flask_jwt_extended import current_user, jwt_required
from marshmallow import EXCLUDE, ValidationError

from devgag_api.flask_extensions import csrf_protect, marshmallow
from devgag_api.flask_utils import api_error, api_res
from devgag_api.models import User
from devgag_api.schemas import UserSchema

blueprint = Blueprint(
    "user",
    __name__,
    url_prefix="/user",
)


@blueprint.route("/getme", methods=["POST"])
@csrf_protect.exempt
@jwt_required()
def get_me():
    """Getting current logged User details."""

    user_schema = UserSchema()
    user_data = user_schema.dump(current_user)

    return api_res(
        res_desc="User successfully loaded.",
        res_data=user_data,
    )


@blueprint.route("/get", methods=["POST"])
@csrf_protect.exempt
@jwt_required()
def get_user():
    """Getting a User Details."""

    json_body = request.get_json(force=True, silent=True)

    # Schema to validate "Req." JSON body data.
    JsonBodySchema = marshmallow.Schema.from_dict(  # noqa: N806
        {
            "user_id": marshmallow.Int(required=True, allow_none=False),
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
        user = User.query.filter_by(id=parsed_json_body["user_id"]).first()
    except Exception as err2:
        return api_error(
            400,
            "Error occurred while getting a user.",
            err_obj=err2,
        )

    if not user:
        return api_error(
            400,
            "User don't exist.",
        )

    # Prevent normal user accessing other user's details. (Unless its admin user.)
    if current_user.id != user.id and current_user.is_admin is False:
        return api_error(
            403, "You don't have authorization to access this user details."
        )

    user_schema = UserSchema()
    user_data = user_schema.dump(user)

    return api_res(
        res_desc="User successfully loaded.",
        res_data=user_data,
    )
