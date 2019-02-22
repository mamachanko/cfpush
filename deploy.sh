#!/usr/bin/env bash -ex

# echo -n "Press any key to continue..." && read

cf create-space simple-chat

cf target -s simple-chat

cf push \
    chat-app \
    -p chat-app/build \
    -b staticfile_buildpack \
    --hostname simple-chat

cf scale \
    chat-app \
    -m 64M \
    -k 128M \
    -f

cf push \
    message-service \
    -p message-service/target/messages-services-0.0.1-SNAPSHOT.jar

cf map-route \
    message-service \
    cfapps.io \
    --hostname simple-chat \
    --path /api