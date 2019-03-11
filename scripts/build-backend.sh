#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

cd ../message-service

./mvnw clean verify package
