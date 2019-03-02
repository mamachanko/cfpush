#!/usr/bin/env bash -ex

HOST=${1:-http://localhost:8080}

function randomMessage() {
    RANDOM_TEXT=$(
        cat /dev/random \
            | head -n 3 \
            | shasum \
            | tr -cd '[[:alnum:]]'
            )

    echo "{\"text\": \"${RANDOM_TEXT}\"}"
}

curl \
    --verbose \
    --request POST \
    --header "Content-Type: application/json" \
    --data "$(randomMessage)" \
    --url "${HOST}/api/messages" \
    | jq