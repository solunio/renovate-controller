FROM node:12.10.0-alpine

ENV base /home/renovate
WORKDIR ${base}

# ADD Server runtime
ADD server/dist ./server/dist
ADD server/package.json ./server/package.json
ADD server/yarn.lock ./server/yarn.lock

# ADD Client bundles
ADD client/dist ./client/dist

ADD package.json ./package.json

RUN apk add git &&\
	npm install -g python &&\
	npm install -g renovate &&\
    yarn server install --production --frozen-lockfile &&\
    yarn cache clean &&\
    rm -rf /root/ &&\
    mkdir /root

VOLUME ["${base}/logs"]

ENV CONFIG_PATH /home/renovate/config/config.json
ENV RENOVATE_CONFIG_FILE /home/renovate/config/config.js
ENV NODE_ENV live
ENV PORT 8080

EXPOSE ${PORT}
CMD ["yarn", "start"]
