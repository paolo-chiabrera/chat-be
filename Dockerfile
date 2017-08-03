FROM node:8

MAINTAINER Paolo Chiabrera <paolo.chiabrera@gmail.com>

ENV NODE_ENV production

ENV PORT 80

ENV PM2_HOME /home/app/.pm2

RUN npm install pm2@latest -g

# cache npm install be

ADD package.json /tmp/package.json

RUN cd /tmp && npm install --production

RUN mkdir -p /home/app && cp -a /tmp/node_modules /home/app/

# cache npm install fe

ADD chat-fe/package.json /tmp/chat-fe/package.json

RUN cd /tmp/chat-fe && npm install --dev

RUN mkdir -p /home/app/chat-fe && cp -a /tmp/chat-fe/node_modules /home/app/chat-fe/

# copy the app content

ADD . /home/app

WORKDIR /home/app/chat-fe

RUN npm run build

EXPOSE 80

CMD pm2 start /home/app/bin/www -x -i 1 --name app && pm2 save && pm2 logs
