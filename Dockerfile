FROM node:8-alpine
MAINTAINER Gangstead <gangstead@gmail.com>

RUN apk add --update tini
ENTRYPOINT ["/sbin/tini", "--"]

ADD ./ /server
WORKDIR /server
RUN rm -rf node_modules && npm install

EXPOSE 3000:3000
ENV PORT 3000

CMD ["npm", "start"]
