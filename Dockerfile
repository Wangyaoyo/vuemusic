# 使用Daocloud做持续集成，登录时直接使用github授权登录就行了

FROM keymetrics/pm2:latest-alpine

MAINTAINER xiaotian

WORKDIR /app

COPY . /app/

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install \
    && npm run build

# Install bash
RUN echo "https://mirror.tuna.tsinghua.edu.cn/alpine/v3.4/main/" > /etc/apk/repositories
RUN apk update \
    && apk upgrade \
    && apk add --no-cache bash \
    bash-doc \
    bash-completion \
    && rm -rf /var/cache/apk/* \
    && /bin/bash

CMD [ "pm2-runtime", "start", "pm2.json" ]
