# Main entry file for Flask App.

from environs import Env
from livereload import Server, shell

"""Create a flask application instance."""
from devgag_api.app import create_app

env = Env()
env.read_env()
flask_environment = env.str("FLASK_ENV", default="development")
# SIDENOTE : We are manually passing "IS_CUSTOM_FLASK_CMD=True" when flask commands other than "flask run". Ex. "poetry run task build-frontend-assets" / "poetry run task db-migrate-init" / Etc... is executed.
#               Because we wan't to avoid creating a live server in those custom flask commands.
is_custom_flask_cmd = env.bool("IS_CUSTOM_FLASK_CMD", default=False)


if flask_environment == "development" and is_custom_flask_cmd is False:
    # If environment is "development" and NOT a "is_custom_flask_cmd" instance, serving "Flask App" on Special Live Reloading. So any changes reflect on browser automatically.
    app = create_app()
    server = Server(app.wsgi_app)
    server.serve(port=5000, host="0.0.0.0")
else:
    app = create_app()
