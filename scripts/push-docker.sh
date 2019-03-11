#!/usr/bin/env bash

set -euxo pipefail

docker \
    login \
    --username ${DOCKER_USERNAME} \
    --password ${DOCKER_PASSWORD}

docker \
    push \
    mamachanko/cfpush
