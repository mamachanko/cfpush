#!/usr/bin/env bash

set -x

cd $(dirname $0)

cd ../message-service

./mvnw clean
