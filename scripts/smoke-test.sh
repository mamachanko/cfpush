#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

HOST=${1:-http://localhost:3000}

function getChatApp() {
    curl \
        --fail \
        --silent \
        --location \
        --request GET \
        --url ${HOST}
}

function createAndGetChatMessages() {
    ./post-message.sh ${HOST}
    ./post-message.sh ${HOST}
    ./get-messages.sh ${HOST}
    ./get-messages.sh ${HOST}
}

getChatApp
createAndGetChatMessages
