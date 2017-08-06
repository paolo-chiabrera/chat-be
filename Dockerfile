FROM node:8-alpine

MAINTAINER Paolo Chiabrera <paolo.chiabrera@gmail.com>

ENV NODE_ENV production

ENV PM2_HOME /home/app/.pm2

# cache npm install

ADD package.json /tmp/package.json

RUN cd /tmp && npm install --production

RUN mkdir -p /home/app && cp -a /tmp/node_modules /home/app/

# copy the app content

ADD . /home/app

WORKDIR /home/app

CMD npm run prod
