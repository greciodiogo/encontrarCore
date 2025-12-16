FROM node:18-alpine as base

WORKDIR /usr/src/app

COPY package*.json ./

FROM base as dev

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3381

CMD ["npm", "run", "dev"]


FROM base as prod

RUN npm install --legacy-peer-deps --only=production

COPY . .

RUN npm install -g @adonisjs/cli

EXPOSE 3381

CMD ["npm", "start"]