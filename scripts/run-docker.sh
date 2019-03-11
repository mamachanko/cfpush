#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

cd ..

docker \
    run \
    --tty \
    --interactive \
    --rm \
    --env CI \
    --env DRY \
    --env CF_USERNAME \
    --env CF_PASSWORD \
    --env CF_ORG \
    --env CF_SPACE \
    --workdir /cfpush \
    --volume $(pwd)/tutorial.sh:/cfpush/tutorial.sh \
    --volume $(pwd)/scripts:/cfpush/scripts \
    cfpush \
    sh tutorial.sh
