#!/usr/bin/env bash -ex

RANDOM_TEXT=$(date | shasum | tr -cd '[[:alnum:]]')
NOW=$(date +%s | cut -b1-13)

curl \
    --silent \
    --request POST \
    --header "Content-Type: application/json" \
    --data "{\"text\": \"${RANDOM_TEXT}\", \"timestamp\": \"${NOW}\"}" \
    --url "http://localhost:8080/api/messages" \
    | jq