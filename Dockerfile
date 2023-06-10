FROM node:18 as development-stage


ENV APPLICATION_NAME=second-gb-app
ENV SASS_BINARY_PATH=/opt/$APPLICATION_NAME/bin/vendor/linux-x64/binding.node

WORKDIR /opt/$APPLICATION_NAME

COPY package.json package-lock.json ./
RUN npm ci
COPY ./ ./
COPY ./.git ./.git

RUN npm run build:api
RUN npm run build:web
RUN npm prune --production

FROM node:18-alpine as production-stage

ENV APPLICATION_NAME=second-gb-app
ENV NODE_ENV=production
WORKDIR /opt/$APPLICATION_NAME

COPY --from=development-stage /opt/$APPLICATION_NAME/node_modules /opt/$APPLICATION_NAME/node_modules
COPY --from=development-stage /opt/$APPLICATION_NAME/dist/ /opt/$APPLICATION_NAME/start.sh /opt/$APPLICATION_NAME/
COPY --from=development-stage /opt/$APPLICATION_NAME/public/ /opt/$APPLICATION_NAME/public/

EXPOSE 3001

CMD ["node", "apps/api/main.js"]

