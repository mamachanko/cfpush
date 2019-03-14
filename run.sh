#!/usr/bin/env bash

set -euo pipefail

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
    mamachanko/cfpush:latest
