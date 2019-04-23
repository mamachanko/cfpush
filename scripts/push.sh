#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

./push-tutor.sh

./push-site.sh

git push
