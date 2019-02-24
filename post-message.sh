#!/usr/bin/env bash -ex

RANDOM_TEXT=$(date | shasum | tr -cd '[[:alnum:]]')
TIMESTAMP=$(date +%s | cut -b1-13)

curl \
    --silent \
    --request POST \
    --header "Content-Type: application/json" \
    --data "{\"text\": \"${RANDOM_TEXT}\", \"timestamp\": \"${TIMESTAMP}\"}" \
    --url "http://localhost:8080/api/messages" \
    | jq