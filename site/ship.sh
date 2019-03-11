#!/usr/bin/env bash

set -euxo pipefail

cf push

git push
