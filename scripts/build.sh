#!/usr/bin/env bash

set -ex

cd $(dirname $0)

./build-backend.sh

./build-frontend.sh

./build-docker.sh
