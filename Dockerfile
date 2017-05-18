FROM ruby:2.4.1-alpine

LABEL maintainer="https://github.com/tootsuite/mastodon" \
      description="A GNU Social-compatible microblogging server"

ENV RAILS_ENV=production \
    NODE_ENV=production

EXPOSE 3000 4000

WORKDIR /mastodon

RUN echo "@edge https://nl.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
 && BUILD_DEPS=" \
    postgresql-dev \
    libxml2-dev \
    libxslt-dev \
    python \
    build-base \
    protobuf-dev" \
 && apk -U upgrade && apk add \
    $BUILD_DEPS \
    nodejs@edge \
    nodejs-npm@edge \
    git \
    libpq \
    libxml2 \
    libxslt \
    ffmpeg \
    file \
    imagemagick@edge \
    ca-certificates \
    protobuf \
 && npm install -g npm@3 && npm install -g yarn \
 && update-ca-certificates \
 && rm -rf /tmp/* /var/cache/apk/*

COPY Gemfile Gemfile.lock package.json yarn.lock /mastodon/

RUN bundle install --deployment --without test development \
 && yarn --ignore-optional --pure-lockfile

COPY . /mastodon

VOLUME /mastodon/public/system /mastodon/public/assets /mastodon/public/packs
