FROM node:20-alpine

WORKDIR /app 


COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 4005


RUN npm run build

CMD [ "npm","run","start:prod" ]