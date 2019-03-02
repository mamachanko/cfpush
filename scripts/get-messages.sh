#!/usr/bin/env bash -ex

HOST=${1:-http://localhost:8080}

curl \
    --verbose \
    --request GET \
    --url "${HOST}/api/messages?page=0&size=20&sort=timestamp,desc" \
    | jq