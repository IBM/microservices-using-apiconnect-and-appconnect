
FROM node:alpine

MAINTAINER Shikha "shikha.mah@in.ibm.com"

RUN apk update && apk upgrade
# Install the application
COPY package.json /app/package.json
RUN cd /app && npm install
COPY app.js /app/app.js
ENV WEB_PORT 8080
EXPOSE  8080

# Define command to run the application when the container starts
CMD ["node", "/app/app.js"]
