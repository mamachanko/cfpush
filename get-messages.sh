#!/usr/bin/env bash -ex

curl \
    --silent \
    --request GET \
    --url "http://localhost:8080/api/messages" \
    | jq