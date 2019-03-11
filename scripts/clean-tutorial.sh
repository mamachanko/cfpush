#!/usr/bin/env bash

set -euxo pipefail

rm -rf builds

cf delete-space interactive-cloud-foundry-tutorial -f || true
