FROM node:10

WORKDIR /app
COPY package.json /app
RUN npm install package.json

COPY . /app

EXPOSE 3000
CMD [ "npm", "start" ]
