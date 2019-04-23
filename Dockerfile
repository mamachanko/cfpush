FROM node:11.14.0-alpine

LABEL description="An interactive Cloud Foundry tutorial in your terminal"
LABEL version="0.1"

RUN apk --no-cache add \
    ca-certificates \
    bash \
    ncurses \
    curl \
    jq

ADD https://cli.run.pivotal.io/stable?release=linux64-binary /tmp/cf-cli.tgz
RUN mkdir -p /usr/local/bin && \
    tar -xzf /tmp/cf-cli.tgz -C /usr/local/bin && \
    cf --version && \
    rm -f /tmp/cf-cli.tgz

WORKDIR /cfpush

COPY tutor/dist .
COPY tutor/node_modules node_modules

COPY builds builds
COPY scripts scripts

CMD ["node", "."]
