#!/usr/bin/env bash -ex

cd $(dirname $0)

cd ../message-service
./mvnw spring-boot:run $@
