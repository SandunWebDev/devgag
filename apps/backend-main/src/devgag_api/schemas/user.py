from devgag_api.flask_extensions import marshmallow
from devgag_api.models import User

# SIDENOTE : Since we are using "marshmallow.SQLAlchemyAutoSchema", All the table fields are automatically added to schema.
#            If want to do manually use "marshmallow.SQLAlchemySchema"


class UserSchema(marshmallow.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_fk = True  # Include forign fields.

        # Fields to expose
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "active",
            "is_admin",
            "created_at",
        )


user_schema = UserSchema()
users_schema = UserSchema(many=True)
