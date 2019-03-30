#!/usr/bin/env bash

set -ex

cd $(dirname $0)

./build-message-service.sh

./build-chat-app.sh

./build-tutorial.sh

./build-tutor-poc.sh
