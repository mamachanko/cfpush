#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

./push-docker.sh

./push-site.sh

git push
