#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

rm -rf ../builds
mkdir ../builds

cf delete-space cfpush-tutorial -f || true

./clean-message-service.sh

./clean-chat-app.sh

./clean-tutor.sh
