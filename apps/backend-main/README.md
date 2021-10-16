# Backend-Main

### Running in Docker (Development / Production)

-   First create `.env` file with relevant keys & values. (See ".env.example" for required keys.)

-   To run the development version of the app.

```bash
poetry run task docker-development
```

-   To run the production version of the app.

```bash
poetry run task docker-production
```

### Running Locally (Development)

-   First create `.env` file with relevant keys & values. (See ".env.example" for required keys.)

-   Make sure necessary service are running on relevant ports. (For Ex. Database Server)

-   Run below initial script to setup necessary things. (Like installing Python dependencies, Node Dependencies, DBMigrations, Etc..)

```bash
poetry run task initial-setup
```

-   Finally, To start flask dev server run below script.

```bash
poetry run task dev
```

You will see a pretty welcome screen.

### Running Tests/Linter

-   To run all tests, run

```bash
poetry run task test
```

-   To run all lintings, run

```bash
poetry run task lint-all
```

### Asset Management

Files placed inside the `assets` directory and its subdirectories (excluding `js` and `css`) will be copied by webpack's `file-loader` into the `src/devgag_api/static/build` directory.
In production, the plugin `Flask-Static-Digest` zips the webpack content and tags them with a MD5 hash.
As a result, you must use the `static_url_for` function when including static content, as it resolves the correct file name, including the MD5 hash.

For example

```html
<link
    rel="shortcut icon"
    href="{{static_url_for('static', filename='build/img/favicon.ico') }}"
/>
```

### More

See `pyproject.toml` file's "[tool.taskipy.tasks]" section for other tasks available.
