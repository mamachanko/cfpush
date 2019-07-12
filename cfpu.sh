#!/usr/bin/env bash

set -euxo pipefail

cd /tmp

curl -LO https://github.com/mamachanko/cfpush/releases/download/v0.1/cfpush.zip
unzip cfpush.zip -d cfpush
cd cfpush

cf version
cf help
cf push --help  # or
cf help push

cf create-space -o mbrauer-personal cfpush-tutorial

cf target -s cfpush-tutorial

cf push chat-app -p builds/chat-app.zip -b staticfile_buildpack --random-route

cf app chat-app

CHAT_APP_HOSTNAME=$(cf app chat-app | awk '/routes/ {gsub(/.cfapps.io/, ""); print $2}')

cf push message-service -p builds/message-service.jar --no-route -m 650M

cf routes

cf map-route message-service cfapps.io --hostname ${CHAT_APP_HOSTNAME} --path /api

# mvp 1

cf apps
cf routes

cf scale chat-app -m 64M -k 128M -f

cf scale message-service -i 3

cf marketplace

cf marketplace -s elephantsql

cf create-service elephantsql turtle database

cf service database

cf bind-service message-service database

cf env message-service

cf restage message-service

# mvp 2

cf logs --recent message-service | grep 'APP\/PROC\/WEB'

cf delete chat-app -f -r
cf delete message-service -f -r

cf push --var chat-app-hostname=${CHAT_APP_HOSTNAME}

cf delete-space cfpush-tutorial -f
