#!/usr/bin/env bash

set -ex

cd $(dirname $0)

./build-message-service.sh

./build-chat-app.sh

./build-tutor.sh
