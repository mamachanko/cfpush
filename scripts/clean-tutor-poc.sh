#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

cd ../tutor-poc

rm -rf node_modules
