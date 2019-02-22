#!/usr/bin/env bash -ex

pushd message-service
    ./mvnw clean verify package
popd
