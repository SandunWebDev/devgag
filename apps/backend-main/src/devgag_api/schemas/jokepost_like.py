from marshmallow import validate

from devgag_api.flask_extensions import marshmallow
from devgag_api.models import JokePostLike

# SIDENOTE : Since we are using "marshmallow.SQLAlchemyAutoSchema", All the table fields are automatically added to schema.
#            But columns that we need to pass additional paramas, declare them using "marshmallow.auto_field()".
#               Mostly this is used to pass things that autofield() does not handle automatically.
#               Such as DB models "CheckConstraint, Validations, Length such as db.String(120), Etc..."
#               But note that things like DB models "nullable/required/..." are automatically handled.


class JokePostLikeSchema(marshmallow.SQLAlchemyAutoSchema):
    class Meta:
        model = JokePostLike
        include_fk = True  # Include forign fields.
        include_relationships = True

    # Custom error messages.
    error_messages = {
        "type": "Provided data are incompatible or invalid. Or data are not provided at all.",  # When invalid data in loaded. (Ex. Not a JSON)
    }

    # --------------- FIELDS

    like = marshmallow.auto_field(
        validate=validate.OneOf([-1, 1]),
    )


jokepost_like_schema = JokePostLikeSchema()
jokepost_likes_schema = JokePostLikeSchema(many=True)
