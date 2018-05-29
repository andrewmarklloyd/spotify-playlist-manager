# take default image of node boron i.e  node 6.x
FROM node:8.10.0

MAINTAINER Andrew Lloyd <andrew85.lloyd@gmail.com>

RUN mkdir -p /app

WORKDIR /app

#ADD package.json /app/

COPY ./dist /app/dist/

COPY ./static /app/static/

COPY ./node_modules /app/node_modules/

EXPOSE 3000

# cmd to start service
CMD [ "node", "dist/index.js" ]
