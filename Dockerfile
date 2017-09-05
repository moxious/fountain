# This Dockerfile is intended to make a docker container out of a single Nectar toolbox job
FROM kkarczmarczyk/node-yarn:8.0
MAINTAINER moxious@oldhat.org

# Create app directory
RUN mkdir -p /src
WORKDIR /src

# Install app dependencies
COPY package.json /src
COPY yarn.lock /src
COPY ./dist/cjs /src
COPY ./init.sh /src

ENV NODE_ENV=production
ENV TZ=UTC

# Install all toolbox deps
RUN yarn install

RUN chmod +x /src/init.sh
ENTRYPOINT ["/src/init.sh"]

