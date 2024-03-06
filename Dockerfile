FROM node:18-alpine

RUN apk add --no-cache tini

RUN npm install -g tsx

ENTRYPOINT ["/sbin/tini", "--"]
