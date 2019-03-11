#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

rm -rf ../builds
mkdir ../builds

cp ../message-service/target/message-service.jar ../builds

pushd ../chat-app/build
    zip -r chat-app.zip *
popd
mv ../chat-app/build/chat-app.zip ../builds

docker \
    build \
    .. \
    --file ../docker/Dockerfile \
    --tag mamachanko/cfpush:latest
