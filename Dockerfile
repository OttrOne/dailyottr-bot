FROM node:alpine

RUN mkdir -p /opt/lexbot
WORKDIR /opt/lexbot

COPY package.json ./

RUN npm install

COPY . .

CMD [ "node", "bot.js" ]
