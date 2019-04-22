FROM node:8.16.0-alpine

LABEL description="An interactive Cloud Foundry tutorial in your terminal."
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
COPY . .
RUN yarn

CMD ["npx", "ts-node", "."]