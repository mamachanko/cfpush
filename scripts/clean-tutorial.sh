#!/usr/bin/env bash

set -euxo pipefail

rm -rf builds

cf delete-space cfpush-tutorial -f || true
