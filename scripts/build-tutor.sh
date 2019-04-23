#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

cd ../tutor

yarn
yarn test

npx tsc --skipLibCheck

docker \
    build \
    . \
    --file ./Dockerfile \
    --tag mamachanko/cfpush:latest
