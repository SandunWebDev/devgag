"""Flask Application Configuration for Testing Purposes."""

ENV = "development"
TESTING = True
SECRET_KEY = "not-so-secret-in-tests"

SQLALCHEMY_DATABASE_URI = "sqlite://"
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Flask Bcrypt
BCRYPT_LOG_ROUNDS = 4  # For faster tests; needs at least 4 to avoid "ValueError: Invalid rounds"

# Flask Caching
CACHE_TYPE = "simple"  # Can be "memcached", "redis", etc.

# Flask Debug Toolbar
DEBUG_TB_ENABLED = False

# FLASK WTF
WTF_CSRF_ENABLED = False  # Allows form testing
