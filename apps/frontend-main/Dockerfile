# ******************************************* BUILD STAGE 1 - Base Dependencies *******************************************
# Loading official Node image as base image (Insetead of lean alpine version) because we need build tools for run modules like webpack.
# Also its used as full fedged developer enviroment.

FROM node:16 as base

RUN mkdir /app
WORKDIR /app

# Copying dependencies(package.json & package-lock.json) first to make use of cache layer.
COPY package*.json ./

# Installing production and developer dependencies regardless of NODE_ENV.
RUN npm install --only=production --quiet && npm install --only=development --quiet && npm cache clean --force

# To fix some Permission Issues.
RUN mkdir -p /app/node_modules/.cache && chmod -R 777 /app/node_modules/.cache

# Adding node_modules binary to PATH.
ENV PATH /app/node_modules/.bin:$PATH


# ******************************************* SUB BUILD STAGE - For Development/Testing *******************************************
FROM base as dev

# Exposing Ports For Local Development Server
EXPOSE 3000

# Copying Source Code.
COPY . ./

CMD npm start

# ******************************************* SUB BUILD STAGE - For Produce React Artifacts *******************************************
FROM dev as build

# Initially almost every CI platforms set "CI" env. variable to "true". But "npm run build" fail if that's the case.
# So setting it to "false" for successfull build in CI enviroment.
ENV CI false

# To fix "exceeded heap" error in low memory vm.
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Building React Prodcution Files.
RUN npm run build

# ******************************************* FINAL BUILD STAGE - Production Build *******************************************
# Loading official Node Alpine image as final image (For Smaller Finalized Image).
FROM nginx:1.14-alpine as prod
EXPOSE 80

# Copying React build artifacts from previous stage.
COPY --from=build /app/build /usr/share/nginx/html

# Copying cutomized nginx config to work with react router.
COPY --from=build /app/docker/nginx/default.conf /etc/nginx/conf.d/

CMD ["nginx", "-g", "daemon off;"]
