#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

cd ..

asciinema rec \
    cfpush.asciinema \
    --overwrite \
    --title cfpush \
    --command './scripts/run-tutorial.sh'

cat cfpush.asciinema \
    | svg-term \
        --window \
        --from 2000 \
        --out cfpush.svg
