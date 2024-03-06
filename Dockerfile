FROM node:18-alpine

RUN apk add --no-cache tini

RUN npm install -g tsx npm@^10.3.0

ENTRYPOINT ["/sbin/tini", "--"]
