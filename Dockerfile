FROM keymetrics/pm2:latest-alpine

ADD . /app
WORKDIR /app
RUN npm install
CMD ["npm", "start"]
