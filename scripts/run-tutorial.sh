#!/usr/bin/env bash

set -euo pipefail

cd $(dirname $0)

cd ../tutor

npx ts-node . ../cfpush.yaml
