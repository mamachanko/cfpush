#!/usr/bin/env bash

set -ex

cd $(dirname $0)

cd ../chat-app
yarn
yarn start
