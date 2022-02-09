
FROM node:latest

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./

RUN npm ci && npm cache clean --force

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

COPY server.js /usr/src/app/

CMD [ "node", "server" ]
