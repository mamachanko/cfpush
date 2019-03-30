#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

cd ../tutor-poc

yarn
yarn test
