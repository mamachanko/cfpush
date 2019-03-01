#!/usr/bin/env bash -ex

cd $(dirname $0)

pushd ../message-service
    ./mvnw clean verify package
popd

pushd ../chat-app
    rm -rf build
    CI=true yarn test
    yarn build
    cp Staticfile build
popd
