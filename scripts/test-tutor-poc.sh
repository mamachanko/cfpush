#!/usr/bin/env bash

set -ex

cd $(dirname $0)

CI=true ../tutor-poc/run.sh
