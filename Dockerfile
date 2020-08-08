FROM node:13.7.0-alpine

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install && npm cache clean --force

COPY . /app

RUN npm run build

CMD ["npm", "run", "start:prod"]
