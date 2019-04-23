#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

cd ../tutor

rm -rf dist
rm -rf node_modules
