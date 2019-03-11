#!/usr/bin/env bash

set -euxo pipefail

HOST=${1:-http://localhost:8080}

function randomMessage() {
    RANDOM_TEXT=$(
        cat /dev/random \
            | head -n 3 \
            | sha1sum \
            | tr -cd '[[:alnum:]]'
            )

    echo "{\"text\": \"${RANDOM_TEXT}\"}"
}

curl \
    --fail \
    --verbose \
    --request POST \
    --header "Content-Type: application/json" \
    --data "$(randomMessage)" \
    --url "${HOST}/api/messages" \
    | jq