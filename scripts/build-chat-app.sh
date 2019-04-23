#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

cd ../chat-app

rm -rf build
yarn
CI=true yarn test
yarn build
cp Staticfile build

pushd build
    zip -r chat-app.zip *
popd
mv build/chat-app.zip ../builds
