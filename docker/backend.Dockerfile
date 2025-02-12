#  Dockerfile for Node Express Backend

FROM node:10.16-alpine

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY ../../package*.json ./

RUN npm install --silent

# Copy app source code
COPY ../../ .

RUN sed -i "s|\"use strict\";|\"use strict\";\nconst {TextDecoder, TextEncoder} = require(\"util\"); |g" /usr/src/app/node_modules/whatwg-url/lib/encoding.js

# Exports
EXPOSE 6969

CMD ["npm","start"]