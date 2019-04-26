#!/usr/bin/env bash

set -euo pipefail

cd $(dirname $0)

CONFIG=${1:-../cfpush.yaml}

cd ../tutor

npx ts-node . ${CONFIG}
