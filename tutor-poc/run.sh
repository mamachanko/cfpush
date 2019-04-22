#!/usr/bin/env bash

set -euo pipefail

cd $(dirname $0)

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
    --volume $(pwd)/tutorial.ts:/cfpush/tutorial.ts \
    --volume $(pwd)/cfpush.log:/cfpush/cfpush.log \
    --volume $(pwd)/../builds:/cfpush/builds \
    --volume $(pwd)/../scripts:/cfpush/scripts \
    mamachanko/tutor-poc:latest