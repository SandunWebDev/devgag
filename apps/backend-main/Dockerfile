##############################################################################################
# Base Stage
#   - Creating a Python Base with "Shared Environment Variables".
##############################################################################################

FROM python:3.9.6-slim as python-base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=1.1.10 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1 \
    PROJECT_PATH="/app" \
    VENV_PATH="/app/.venv"

# Adding Poetry and Venv to path.
ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"

# Custom Env Variables
ENV DEVELOPMENT_EXPOSE_PORT=5000 \
    PRODUCTION_EXPOSE_PORT=5001

# Changing docker "RUN" command executable to use "bash". (Default is "sh")
SHELL ["/bin/bash", "-c"]


##############################################################################################
# Builder Stage
#   - Adding Build Dependencies
##############################################################################################

FROM python-base as builder-base

RUN apt-get update \
    && apt-get install --no-install-recommends -y \
    curl \
    build-essential

# Install Poetry (Respects $POETRY_VERSION & $POETRY_HOME)
RUN curl -sSL https://install.python-poetry.org | python3 -

# Copying "Projects Package List" to cache them. (pyproject.toml)
WORKDIR $PROJECT_PATH
COPY ./poetry.lock ./pyproject.toml ./

# Installing only "Production Packages" using Poetry.
# Also Virtual Env. is automatically created inside WORKDIR according to $POETRY_VIRTUALENVS_IN_PROJECT.
# SIDE NOTE : Notice "--no-root" argument is defined to avoid installing "Our Source Code Package" itself as dependency. (Which is defined in "packages" in "pyproject.toml")
#               We have to do this beacuse, We haven't copied our source code into docker yet. So installing itself is not possible. Also its generally good to avoid it. (Called Editable Install)
RUN poetry install --no-dev --no-root


##############################################################################################
# Development Stage
#   - This stage installs all "Development Packages" and can be used to develop code.
#     (For example using "docker-compose" to mount local volume under "/app")($PROJECT_PATH)
##############################################################################################

FROM python-base as development

WORKDIR $PROJECT_PATH

# Installing "git" and Initializing "git project". (Because some tools like isort, flake, etc.. depend on git)
RUN apt-get -y update && apt-get -y install git
RUN git init

# Copying Poetry and Venv into image. (Along with some other files in $PROJECT_PATH, added in previous stages.)
COPY --from=builder-base $POETRY_HOME $POETRY_HOME
COPY --from=builder-base $PROJECT_PATH $PROJECT_PATH

# Copying docker related files. (Ex."Entrypoint" file, Etc..)
# Also making all ".sh" file executable.
COPY ./docker ./docker
RUN chmod +x ./docker/**/*.sh

# Script to Install Custom Languages.
# Installing NodeJs (Needed for some Custom Development Task)
RUN ./docker/scripts/custom_lang_installer.sh
ENV PATH="~/.asdf/bin:~/.asdf/shims:${PATH}"

# Installing Spcial Other Lanaguage Projects Dependencies. (Ex. NodeJS WebPack Builder, NodeJSRunner)
COPY ./apps/frontend-assets/package*.json ./apps/frontend-assets/
COPY ./scripts ./scripts
RUN ./docker/scripts/custom_proj_dependency_installer.sh

# Installing "Developer Packages". (Since we have copied previous stage "venv", "Production Packages" are already installed. So we get a quicker install.)
RUN poetry install --no-root

# Copying all other source code files into "$PROJECT_PATH" folder.
COPY . .

# Install "Our Source Code Package" itself as dependency by not passing "--no-root". (Which is prevented in previous stages using "--no-root")
RUN poetry install

# Applying Migrations to Database
RUN poetry run task db-migrate-apply

EXPOSE $DEVELOPMENT_EXPOSE_PORT
ENTRYPOINT ./docker/scripts/docker_entrypoint.sh $0 $@
CMD ["./docker/scripts/starter-development.sh"]

##############################################################################################
# Quality Check Stage
#   - Linting, Prettyfying, Testing, TypeChecking, Etc... here to Quality Check full source code.
#     Failing here will stop creating final image.
##############################################################################################

FROM development AS code-quality

# Linting
RUN poetry run task lint-all
# Testing
RUN poetry run task test && poetry run task test-coverage
# Docs
RUN poetry run task docs-build

ENTRYPOINT ./docker/scripts/docker-entrypoint.sh $0 $@
CMD ["tail", "-f", "/dev/null"]

##############################################################################################
# Artifacts Stage
#   - Generating artifacts (Ex. Frontend Asset Builds, DocsBuils, Etc...)
#   - These generated files will be used in production stage.
##############################################################################################

FROM development AS artifacts-builder

# Building Frontend Assets.
# Similar to "poetry run task build-frontend-assets" script.
RUN cd ./apps/frontend-assets && npm run build

ENTRYPOINT ./docker/scripts/docker-entrypoint.sh $0 $@
CMD ["tail", "-f", "/dev/null"]


##############################################################################################
# Production Stage
#   - This stage uses the clean 'python-base' stage and copyies in only our "Production Packages" that were installed in the 'builder-base' stage.
##############################################################################################

FROM python-base as production

WORKDIR $PROJECT_PATH

# Installing NginX.
RUN apt-get -y update && apt-get install -y nginx

# Setup nginx.
RUN rm /etc/nginx/sites-enabled/default
COPY ./docker/nginx/backend-main.conf /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/backend-main.conf /etc/nginx/sites-enabled/backend-main.conf
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

# Copying Poetry & Venv into image. (Which Production Packages are already installed.)
# Also along with some other files in $PROJECT_PATH, added in previous stages.
COPY --from=builder-base $POETRY_HOME $POETRY_HOME
COPY --from=builder-base $PROJECT_PATH $PROJECT_PATH

# Copying SupervisorD Programs.
COPY ./docker/supervisord/supervisord.conf /etc/supervisor/supervisord.conf
COPY ./docker/supervisord/supervisord_programs /etc/supervisor/conf.d

# Copying only relevant files and folders needed for "Production Usage" into $PROJECT_PATH folder.
COPY --from=development /app/docker /app/docker
COPY ./src ./src
COPY ./database ./database
COPY ./autoapp.py ./autoapp.py
COPY .env .env
COPY ./README.md ./README.md

# Copying Artifacts.
COPY --from=artifacts-builder /app/src/devgag_api/static /app/src/devgag_api/static

# All "Production Packages" are already installed. But In here we are just running to install "Our Source Code Package" itself as dependency, which is prevented in previous stages using "--no-root"
RUN poetry install --no-dev

# Applying Migrations to Database
RUN poetry run task db-migrate-apply

# Applyying Some Initial Seed Data (Remove this if not need any initial data)
RUN poetry run task db-initial-seeddata-apply 

EXPOSE $PRODUCTION_EXPOSE_PORT
ENTRYPOINT ./docker/scripts/docker_entrypoint.sh $0 $@
CMD ["./docker/scripts/starter-production.sh"]
