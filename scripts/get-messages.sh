#!/usr/bin/env bash

set -euxo pipefail

HOST=${1:-http://localhost:8080}

curl \
    --fail \
    --verbose \
    --request GET \
    --url "${HOST}/api/messages?page=0&size=20&sort=timestamp,desc" \
    | jq .
