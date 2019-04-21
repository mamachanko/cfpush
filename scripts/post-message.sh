#!/usr/bin/env bash

set -euxo pipefail

HOST=${1:-http://localhost:8080}

curl \
    --fail \
    --verbose \
    --request POST \
    --header "Content-Type: application/json" \
    --data "{\"text\": \"$(date)\"}" \
    --url "${HOST}/api/messages" \
    | jq .