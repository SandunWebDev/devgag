"""Flask Extensions List.

Each extension is initialized in the app factory located in app.py.
"""

from flask_bcrypt import Bcrypt
from flask_caching import Cache
from flask_cors import CORS
from flask_debugtoolbar import DebugToolbarExtension
from flask_jwt_extended import JWTManager
from flask_login import LoginManager
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_static_digest import FlaskStaticDigest
from flask_wtf.csrf import CSRFProtect

bcrypt = Bcrypt()
login_manager = LoginManager()
db = SQLAlchemy()
migrate = Migrate()
cache = Cache()
debug_toolbar = DebugToolbarExtension()
flask_static_digest = FlaskStaticDigest()


# SIDENOTE : Some decorator callback related to this extension is declared in "devgag_api/blueprints/api/auth/views.py" file.
#            Mainly automatic serializing and deserializing of User data when in login / protected route / etc...
jwt = JWTManager()


cors = CORS(
    None,
    resources="/api/*",  # Enabling CORS Allow only for "/api/xxx" endpoint paths.
)
csrf_protect = CSRFProtect()  # Some configuration on this done on "app.py"


# SideNote : We have pip installed "marshmallow-sqlalchemy" along with this. It will automatically integrated to this.
marshmallow = Marshmallow()
