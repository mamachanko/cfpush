#!/usr/bin/env bash -ex

RANDOM_TEXT=$(date | shasum | tr -cd '[[:alnum:]]')

curl \
    --silent \
    --request POST \
    --header "Content-Type: application/json" \
    --data "{\"text\": \"${RANDOM_TEXT}\"}" \
    --url "http://localhost:8080/api/messages" \
    | jq