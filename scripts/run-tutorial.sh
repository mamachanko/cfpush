#!/usr/bin/env bash

set -euo pipefail

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
    --volume $(pwd)/tutorial.sh:/cfpush/tutorial.sh \
    --volume $(pwd)/builds:/cfpush/builds \
    --volume $(pwd)/scripts:/cfpush/scripts \
    mamachanko/cfpush:latest
