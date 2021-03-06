from devgag_api.flask_extensions import marshmallow
from devgag_api.models import User

# SIDENOTE : Since we are using "marshmallow.SQLAlchemyAutoSchema", All the table fields are automatically added to schema.
#            But columns that we need to pass additional paramas, declare them using "marshmallow.auto_field()".
#               Mostly this is used to pass things that autofield() does not handle automatically.
#               Such as DB models "CheckConstraint, Validations, Length such as db.String(120), Etc..."
#               But note that things like DB models "nullable/required/..." are automatically handled.


class UserSchema(marshmallow.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_fk = True  # Include forign fields.
        include_relationships = True

        exclude = ("_password",)


user_schema = UserSchema()
users_schema = UserSchema(many=True)
