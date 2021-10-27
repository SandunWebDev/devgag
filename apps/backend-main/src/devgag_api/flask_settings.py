"""Flask Application Configuration.

- Specifying configs needed for Flask & Flask Plugins.
- Most configurations are set via environment variables.
  For local development, use a .env file to set environment variables.

"""

from environs import Env

env = Env()
env.read_env()

ENV = env.str("FLASK_ENV", default="production")
DEBUG = ENV == "development"
SEND_FILE_MAX_AGE_DEFAULT = env.int("SEND_FILE_MAX_AGE_DEFAULT", default=0)
SECRET_KEY = env.str("SECRET_KEY")

# Flask SqlAlchemy
SQLALCHEMY_DATABASE_URI = env.str("DATABASE_URL")
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = env.bool("SQLALCHEMY_ECHO")

# Flask JWT
JWT_SECRET_KEY = env.str("SECRET_KEY")
JWT_TOKEN_LOCATION = env.list("JWT_TOKEN_LOCATION")
JWT_ACCESS_TOKEN_EXPIRES = env.int("JWT_ACCESS_TOKEN_EXPIRES")
JWT_REFRESH_TOKEN_EXPIRES = env.int("JWT_REFRESH_TOKEN_EXPIRES")
JWT_ALGORITHM = env.str("JWT_ALGORITHM")

# Flask Bcrypt
BCRYPT_LOG_ROUNDS = env.int("BCRYPT_LOG_ROUNDS", default=13)

# Flask Caching
CACHE_TYPE = "simple"  # Can be "memcached", "redis", etc.

# Flask Debug Toolbar
DEBUG_TB_ENABLED = DEBUG
DEBUG_TB_INTERCEPT_REDIRECTS = False

# Custom
UPLOAD_STORAGE_BASE_PATH = env.str("UPLOAD_STORAGE_BASE_PATH")
UPLOAD_STORAGE_FOLDER_NAME = env.str("UPLOAD_STORAGE_FOLDER_NAME")
