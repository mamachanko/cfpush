#!/usr/bin/env bash

set -ex

cd $(dirname $0)

CI=true ../run.sh
