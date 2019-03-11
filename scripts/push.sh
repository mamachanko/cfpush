#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

./push-tutorial.sh

./push-site.sh

git push
