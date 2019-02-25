#!/usr/bin/env bash -ex

cd $(dirname $0)

pushd ../message-service
    ./mvnw clean verify package
popd

pushd ../chat-app
    rm -rf build
    yarn build
    cp Staticfile build
popd
