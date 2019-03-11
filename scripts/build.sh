#!/usr/bin/env bash

set -ex

cd $(dirname $0)

./build-message-service.sh

./build-frontend.sh

./build-docker.sh
