from marshmallow import ValidationError, post_load, validate, validates_schema

from devgag_api.flask_extensions import marshmallow
from devgag_api.models import JokePost, JokePostLike
from devgag_api.schemas.jokepost_like import JokePostLikeSchema
from devgag_api.schemas.user import UserSchema

# SIDENOTE : Since we are using "marshmallow.SQLAlchemyAutoSchema", All the table fields are automatically added to schema.
#            But columns that we need to pass additional paramas, declare them using "marshmallow.auto_field()".
#               Mostly this is used to pass things that autofield() does not handle automatically.
#               Such as DB models "CheckConstraint, Validations, Length such as db.String(120), Etc..."
#               But note that things like DB models "nullable/required/..." are automatically handled.


class JokePostSchema(marshmallow.SQLAlchemyAutoSchema):
    class Meta:
        model = JokePost
        include_fk = True  # Include forign fields.
        include_relationships = True

    # Custom error messages.
    error_messages = {
        "type": "Provided data are incompatible or invalid. Or data are not provided at all.",  # When invalid data in loaded. (Ex. Not a JSON)
    }

    # --------------- FIELDS

    type = marshmallow.auto_field(
        validate=validate.OneOf(["TEXT", "MEME"]),
    )

    title = marshmallow.auto_field(
        validate=[
            validate.Length(min=1, error="Can not be empty."),
            validate.Length(max=120),
        ],
    )

    text_joke = marshmallow.auto_field(
        validate=[
            validate.Length(
                min=1, error="Empty value. Only required when type is TEXT."
            ),
        ],
    )

    meme_joke = marshmallow.auto_field(
        validate=[
            validate.Length(
                min=1, error="Empty value. Only required when type is MEME."
            ),
        ],
    )

    # ------------------- Fields from Relationships
    #   - Assigning schema for them so they show all details instead of just primary/forign ids. (Similar to MongoDB)
    populated__created_by = marshmallow.Nested(
        UserSchema(
            exclude=[
                "_password",
                "is_admin",
                "active",
                "created_at",
                "backref__roles",
                "backref__jokeposts",
            ]
        )
    )

    populated__likeslist = marshmallow.Nested(
        JokePostLikeSchema(
            only=[
                "id",
                "user_id",
                "like",
            ],
            many=True,
        )
    )

    # ------------------- Custom Fields

    total_likes = marshmallow.Method("total_likes_fn")
    total_dislikes = marshmallow.Method("total_dislikes_fn")

    def total_likes_fn(self, obj):
        return (
            JokePostLike.query.filter(JokePostLike.jokepost_id == obj.id)
            .filter(JokePostLike.like == 1)
            .count()
        )

    def total_dislikes_fn(self, obj):
        return (
            JokePostLike.query.filter(JokePostLike.jokepost_id == obj.id)
            .filter(JokePostLike.like == -1)
            .count()
        )

    # ------------------- Decorators

    # Validation involving multiple columns.
    @validates_schema(skip_on_field_errors=True)
    def validate_things_on_schema_level(self, data, **kwargs):
        errors = {}

        # When type column is 'TEXT', text_joke column must have a value.
        if (
            data["type"] == "TEXT"
            and len(data.get("text_joke", "")) == 0  # noqa: WPS507
        ):
            errors["text_joke"] = [
                "When type is 'TEXT', text_joke must have a value."
            ]

        # When type column is 'MEME', meme_joke column must have a value.
        if (
            data["type"] == "MEME"
            and len(data.get("meme_joke", "")) == 0  # noqa: WPS507
        ):
            errors["meme_joke"] = [
                "When type is 'MEME', meme_joke must have a value."
            ]

        if errors:
            raise ValidationError(errors)

    # Further formatting what should be displayed on xxx.load() result.
    @post_load
    def remove_unnecessary_fields(self, data, **kwargs):
        modified_data = {**data}

        # When type column is 'TEXT', meme_joke column must have a value.
        if data["type"] == "TEXT":
            modified_data.pop("meme_joke", None)

        # When type column is 'MEME', text_joke column must have a value.
        if data["type"] == "MEME":
            modified_data.pop("text_joke", None)

        return modified_data


jokepost_schema = JokePostSchema()
jokeposts_schema = JokePostSchema(many=True)
