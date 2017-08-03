FROM node:8-alpine

MAINTAINER Paolo Chiabrera <paolo.chiabrera@gmail.com>

ENV NODE_ENV production

ENV PORT 3000

ENV PM2_HOME /home/app/.pm2

RUN npm install pm2@latest -g

# cache npm install

ADD package.json /tmp/package.json

RUN cd /tmp && npm install --production

RUN mkdir -p /home/app && cp -a /tmp/node_modules /home/app/

# copy the app content

ADD . /home/app

WORKDIR /home/app

EXPOSE 3000

CMD pm2 start /home/app/bin/www -x -i 1 --name app && pm2 save && pm2 logs
