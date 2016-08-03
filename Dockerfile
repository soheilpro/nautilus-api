FROM node:latest

RUN npm install -g typescript

RUN mkdir -p /usr/app
COPY . /usr/app

WORKDIR /usr/app/src

RUN npm install
RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
