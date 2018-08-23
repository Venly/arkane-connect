# Dockerfile

FROM node:10.6.0-alpine

RUN npm config set registry https://registry.npmjs.org/
RUN npm config set //registry.npmjs.org/:_authToken d621ea1a-e712-4353-9e5e-5fa13cbb26b7

WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build

ENV NODE_ENV=production
ENV PORT=4001

CMD npm run start

EXPOSE 4001