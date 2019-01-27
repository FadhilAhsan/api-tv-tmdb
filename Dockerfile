FROM node:10.15

# Create app directory
RUN mkdir -p ./app/nodejs/backend-my-tv-tmdb
WORKDIR /app/nodejs/backend-my-tv-tmdb

# Install app dependencies
COPY package.json /app/nodejs/backend-my-tv-tmdb/
COPY package-lock.json /app/nodejs/backend-my-tv-tmdb/

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
