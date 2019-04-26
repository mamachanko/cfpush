#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

cd ../message-service

./mvnw clean verify package

cp target/message-service.jar ../builds/message-service.jar
