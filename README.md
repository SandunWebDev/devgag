# **DevGag**

DevGag is a WebApp where users can explore and add "Dev Jokes". (Both Textual and Meme Type) This full-stack project is mainly powered by **Python, Flask & React**.

See Live Demo at [DevGag.com](https://devgag.herokuapp.com/). (Please note that, Since this app is currently hosted on free Heroku Dyno, it takes few more seconds to get up and running and requests are slow.)

<p align="center">
  <img src="resources/devgag_demo.gif"/>
</p>

<br/>

---

## **App-wise & Technical-wise Features**

-   Explore/Add DevJokes in Text and Meme Format
-   Filter DevJokes ByCategories/ByType/Etc...
-   Like/Dislike Posts
-   Login/Signup OR Guest Mode
-   Light/Dark Mode Switching
-   Infinte Scrolling
-   Responsive/Mobile Friendly
-   Settings Persisting
-   Etc...

<br/>

---

## **Used Technologies**

Main technologies and tools used for this project.

| FrontEnd     | BackEnd                       | Tools                                  | DevOps + Other         |
| ------------ | ----------------------------- | -------------------------------------- | ---------------------- |
| React        | Python                        | ISort + Black + Flake8 + Mypy + Safety | Docker + DockerCompose |
| React Router | Flask                         | ESLint + Prettier + StyleLint          | NginX                  |
| Formik + Yup | Jinga2 Templates              | PreCommit Hooks                        | Google Analytics       |
| JWT          | PostgreSQL + SQLAlchemy       |                                        | Heroku                 |
| ChakraUI     | Alembic DB Migrations         |                                        | Python Poetry          |
|              | FlaskJWT + FlaskBCrypt        |                                        |                        |
|              | Marshmallow Schemas           |                                        |                        |
|              | Gunicorn + NginX + Supervisor |                                        |                        |
|              | SphinX                        |                                        |                        |
|              | PyTest                        |                                        |                        |

<br/>
<br/>

---

## **How To Run**

-   First of all, Create `.env` file with relevant fields and values. Check `.env.example` for necessary fields.
-   Make sure NodeJS, Python and Poetry are installed on system.
-   Then run `poetry install` to install base dependencies. (Make sure Python Virtual Enviroment is activated. `poetry shell`)
-   Then run `poetry run task initial-setup` to install Frontend/Backend dependencies, setup databases, setup PreCommit hooks, etc...,

### # USING DOCKER

-   Backend

    -   Change directory to `apps/backend-main`.
    -   Just run `poetry run task docker-development`. It will install and run all the docker dependencies and services need to run this project. Then you can interact with the program through http://localhost:5000.
    -   Use `docker-development-stop` to stop Docker containers gracefully (otherwise unexpected errors occurs sometimes.) and `docker-development-shell` to shell inside the container.

-   Frontend
    -   Change directory to `apps/frontend-main`.
    -   Just run `npm run docker-development`. It will install and run all the dependencies and services need to run this project. Then you can interact with the program through http://localhost:3000.
    -   Use `docker-development-stop` to stop Docker containers gracefully (otherwise unexpected errors occurs sometimes.) and `docker-development-shell` to shell inside the container.

### # USING NORMAL WAY

-   Backend
    -   Change directory to `apps/backend-main`.
    -   Then run `poetry run task dev`. Now you can interact with program through http://localhost:5000.
    -
-   Frontend
    -   Change directory to `apps/frontend-main`.
    -   Then run `npm start`. Now you can interact with program through http://localhost:3000.

<br/>

---

## **How To Run DB Migrations/Seedings**

-   Generating Initial Migration File : `poetry run task db-migrate-init`
-   Updating Migration Files : `poetry run task db-migrate-genMigrations` (If Schema changed, Run this.)
-   Applying Migration into DB : `poetry run task db-migrate-apply` (If Schema changed OR It's initial db setup, Run this.)
-   Initial Data Seeding : `db-initial-seeddata-apply ` (If Wanted)

<br/>

---

## **How To Lint/Code Quality**

-   Backend

    -   Run `poetry run task lint-all`. (This runs ISort, Black, Flake8, Mypy & Safety)
    -   Run `poetry run task test` for Test Suite.

-   Frontend
    -   Run `npm run lint-all`. (This runs ISort, Black, Flake8, Mypy & Safety)
    -   Run `npm run test` for Test Suite.

---
