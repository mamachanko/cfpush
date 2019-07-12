#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

rm -rf ../builds/cfpush.zip

zip \
    --recurse-paths \
    ../builds/cfpush.zip \
    ../builds \
    ../manifest.yml

zipinfo ../builds/cfpush.zip