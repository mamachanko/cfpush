#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

cd ../site

cf target \
    -o cfpush \
    -s production

cf push
