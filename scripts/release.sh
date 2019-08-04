#!/usr/bin/env bash
#cfpush:usage creates release as ZIP file

set -euxo pipefail

cd $(dirname $0)

rm -rf ../builds/cfpush.zip

zip \
    --recurse-paths \
    ../builds/cfpush.zip \
    ../builds \
    ../manifest-cfpush.yml

zipinfo ../builds/cfpush.zip
