FROM node:18-alpine as development-stage
USER root

ENV APPLICATION_NAME=gb-demo-app
ENV SASS_BINARY_PATH=/opt/$APPLICATION_NAME/bin/vendor/linux-x64/binding.node

COPY ["package.json", "package-lock.json", "./"]
RUN npm ci
COPY ./ ./


RUN npm run build
RUN npm prune --production

FROM node:18-alpine as production-stage

ENV APPLICATION_NAME=gb-demo-app
ENV NODE_ENV=production
WORKDIR /opt/$APPLICATION_NAME

COPY --from=build-stage /opt/$APPLICATION_NAME/node_modules /opt/$APPLICATION_NAME/node_modules
COPY --from=build-stage /opt/$APPLICATION_NAME/dist/ /opt/$APPLICATION_NAME/start.sh /opt/$APPLICATION_NAME/

EXPOSE 3001

CMD ["node", "apps/api/main.js"]
