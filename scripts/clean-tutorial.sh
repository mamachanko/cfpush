#!/usr/bin/env bash

set -euxo pipefail

cf delete-space interactive-cloud-foundry-tutorial -f || true