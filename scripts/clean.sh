#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

./clean-message-service.sh

./clean-chat-app.sh

./clean-tutorial.sh
