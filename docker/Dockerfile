FROM alpine:3.9.2

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

COPY message-service/target/message-service.jar /cfpush/message-service/target/message-service.jar
COPY chat-app/build /cfpush/chat-app/build
COPY scripts/post-message.sh /cfpush/scripts/post-message.sh
COPY scripts/get-messages.sh /cfpush/scripts/get-messages.sh
COPY tutorial.sh /cfpush/tutorial.sh
