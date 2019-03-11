#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

docker \
    build \
    .. \
    --file ../docker/Dockerfile \
    --tag mamachanko/cfpush:latest
