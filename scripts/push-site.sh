#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

cd ../site

cf login \
    -a api.run.pivotal.io \
    -u ${CF_USERNAME} \
    -p ${CF_PASSWORD} \
    -o ${CF_ORG} \
    -s ${CF_SPACE}

cf target \
    -o cfpush \
    -s production

cf push
