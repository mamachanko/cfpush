#!/usr/bin/env bash

set -euxo pipefail

./clean-message-service.sh

./clean-chat-app.sh

./clean-tutorial.sh
