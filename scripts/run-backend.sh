#!/usr/bin/env bash

set -ex

cd $(dirname $0)

cd ../message-service
./mvnw spring-boot:run $@
