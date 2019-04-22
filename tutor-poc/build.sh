#!/usr/bin/env bash

set -euo pipefail

cd $(dirname $0)

yarn
yarn test

rm -rf dist
npx tsc --skipLibCheck

docker \
    build \
    . \
    --file ./Dockerfile \
    --tag mamachanko/tutor-poc:latest
