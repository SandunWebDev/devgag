"""API Auth Views."""

from pathlib import Path

from flask import (
    Blueprint,
    abort,
    current_app,
    jsonify,
    redirect,
    render_template,
    request,
    url_for,
)
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    current_user,
    get_jwt,
    get_jwt_identity,
    jwt_required,
)
from marshmallow import EXCLUDE, ValidationError, validate

from devgag_api.flask_extensions import csrf_protect, jwt, marshmallow
from devgag_api.flask_utils import api_error, api_res
from devgag_api.models import User
from devgag_api.schemas import user_schema

blueprint = Blueprint(
    "auth",
    __name__,
    url_prefix="/auth",
)

# Register a callback function that takes whatever object is passed in as the "identity" when creating JWTs using "create_access_token()"
#   and converts it to a JSON serializable format. (Simply serializing and defining what will be passed to JWT as content.)
#
# In our case we are getting logging user's "SQLAlchemy DB User Object" from '/api/auth/login' and returning user's id.
@jwt.user_identity_loader  # noqa: E302
def user_identity_serializer_callback(logging_user):
    return logging_user.id


# Register a callback function that loads the user from your database whenever a protected route is accessed. (Through "@jwt_required()" Decorator)
# This should return any python object on a successful lookup, or None if the lookup failed for any reason (for example if the user has been deleted from the database).
# Whatever returned from here can be easily accessed through "flask_jwt_extended --> current_user" attribute.
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data[
        "sub"  # SIDENOTE : By default "identity" value provided when creating token is stored in "sub" claim.
    ]
    return User.query.filter_by(id=identity).one_or_none()


# Register a callback function that automatically "Add Additional Claims & Additional Data" when JWT is created. (create_access_token OR create_refresh_token)
# These data can be accessed inside a protected route using "get_jwt()"
@jwt.additional_claims_loader
def add_claims_to_access_token(identity):
    return {
        # Reserved Claims
        "iss": "DevGag",
        # Additional Data
        "user_id": identity.id,
        "username": identity.username,
    }


# Register a callback function to to execute in certain JWT errors, which return custom errors to user.
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return api_error(err_code=401, err_msg="Token Expired.")


@jwt.invalid_token_loader
def invalid_token_callback(jwt_payload):
    return api_error(err_code=401, err_msg="Invalid Token.")


@jwt.unauthorized_loader
def unprovided_token_callback(jwt_payload):
    return api_error(err_code=401, err_msg="Token not provided.")


@blueprint.route("/login", methods=["POST"])
@csrf_protect.exempt
def login():
    """Loggin by generating JWT. (If valid user)."""

    json_body = request.get_json(force=True, silent=True)
    if not json_body:
        return api_error(400, "Username and Password not provided.")

    username = json_body.get("username", None)
    password = json_body.get("password", None)

    if not username or not password:
        return api_error(401, "Username or Password not provided.")

    user = User.query.filter_by(username=username).first()

    if not user:
        return api_res(
            res_code=400, res_status="fail", res_desc="Unknown User."
        )

    if not user.check_password(password):
        return api_error(401, "Invalid Password")

    # SIDENOTE : By default "identity" value provided when creating token is stored in "sub" claim in the token.
    access_token = create_access_token(identity=user)
    refresh_token = create_refresh_token(identity=user)
    return api_res(
        {"access_token": access_token, "refresh_token": refresh_token}
    )


@blueprint.route("/refresh-token", methods=["POST"])
@csrf_protect.exempt
@jwt_required(
    refresh=True
)  # We are using the `refresh=True` options in jwt_required to only allow refresh tokens to access this route.
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return api_res(
        {
            "access_token": access_token,
        }
    )


@blueprint.route("/signup", methods=["POST"])
@csrf_protect.exempt
def signup():
    # Parsing passed body data into json.
    json_body = request.get_json(force=True, silent=True)
    if not json_body:
        return api_error(400, "Necessary data are not provided.")

    # Schema to validate "Req." JSON body data.
    gen_json_body_schema = marshmallow.Schema.from_dict(
        {
            "email": marshmallow.Email(required=True),
            "password": marshmallow.Str(
                required=True,
                validate=[
                    validate.Length(min=1, error="Required"),
                    validate.Length(min=8),
                ],
            ),
            "first_name": marshmallow.Str(
                required=True,
                validate=[
                    validate.Length(min=1, error="Required"),
                    validate.Length(min=2),
                ],
            ),
            "last_name": marshmallow.Str(
                required=True,
                validate=[
                    validate.Length(min=1, error="Required"),
                    validate.Length(min=2),
                ],
            ),
        }
    )

    # Validating req. body data.
    schema = gen_json_body_schema(unknown=EXCLUDE)
    try:
        parsed_json_body = schema.load(json_body)
    except ValidationError as err:
        return api_error(
            400,
            "Provided data are invalid or incomplete.",
            err_meta=err.messages,
            err_obj=err,
        )

    # Checking user already exist.
    exist_user = User.query.filter_by(
        username=parsed_json_body["email"]
    ).first()
    if exist_user:
        return api_res(
            res_status="fail",
            res_code=403,
            res_data="A user already exist for this email.",
        )

    # Creating new user if not exist already.
    User.create(
        **parsed_json_body, username=parsed_json_body["email"], active=1
    )
    created_user = User.query.filter_by(
        username=parsed_json_body["email"]
    ).first()

    access_token = create_access_token(identity=created_user)
    refresh_token = create_refresh_token(identity=created_user)

    return api_res(
        {"access_token": access_token, "refresh_token": refresh_token},
        res_desc="User created successfully.",
    )


# Temporary helper route check out auth related stuff.
@blueprint.route("/auth-check", methods=["GET", "POST"])
@csrf_protect.exempt
@jwt_required()
def protected():
    # Getting the details of logged user's JWT details (Identity+Additional Claims+Etc...).
    current_jwt_data = get_jwt()

    # Since we have defined "@jwt.user_lookup_loader" hook, through it we get currently logged user details as SqlAlchemy DB object. (As defined in the hook)
    #   Using "flask_jwt_extended.current_user"
    # We can use this to directly access received user column data. (Ex. current_user.name)
    current_user_sqlalchemy_obj = current_user

    # Converting "current_user" data into JSON parsable data using Marchmallow schema.
    current_user_as_json = user_schema.dump(current_user_sqlalchemy_obj)

    return api_res(
        {
            "jwt_details": current_jwt_data,
            "user_details": current_user_as_json,
        },
        res_desc="This is protected route. You can see this mean, you are properly authenticated.",
    )
