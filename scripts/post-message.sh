#!/usr/bin/env bash -ex

HOST=${1:-http://localhost:8080}

function randomMessage() {
    RANDOM_TEXT=$(date | shasum | tr -cd '[[:alnum:]]')
    TIMESTAMP_NOW=$(date +%s | cut -b1-13)

    echo "{\"text\": \"${RANDOM_TEXT}\", \"timestamp\": \"${TIMESTAMP_NOW}\"}"
}

curl \
    --verbose \
    --request POST \
    --header "Content-Type: application/json" \
    --data "$(randomMessage)" \
    --url "${HOST}/api/messages" \
    | jq