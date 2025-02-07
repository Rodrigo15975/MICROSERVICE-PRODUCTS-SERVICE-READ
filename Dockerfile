FROM node:20-alpine

WORKDIR /app 


COPY package*.json ./
RUN npm i
COPY . .


RUN npm run build
EXPOSE 4005

CMD [ "npm","run","start:prod" ]