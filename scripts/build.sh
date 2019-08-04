#!/usr/bin/env bash

set -ex

cd $(dirname $0)

mkdir ../builds || true

./build-message-service.sh

./build-chat-app.sh

./build-tutor.sh
