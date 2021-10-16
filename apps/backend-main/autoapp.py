# Main entry file for Flask App.

from livereload import Server, shell
from environs import Env

"""Create a flask application instance."""
from devgag_api.app import create_app

env = Env()
env.read_env()
flask_environment = env.str("FLASK_ENV", default="development")

if flask_environment == "development":
    # If environment is "development",  serving "Flask App" on Special Live Reloading. So any changes reflect on browser automatically.
    app = create_app()
    server = Server(app.wsgi_app)
    server.serve(port=5000)
else:
    app = create_app()
