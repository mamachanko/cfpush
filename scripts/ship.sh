#!/usr/bin/env bash

set -ex

cd $(dirname $0)

function assertIndexClean() {
    if ! git diff --exit-code --cached > /dev/null; then
        set +x
        echo "$(tput setab 1)ship abort. there are uncommitted changes in the index.$(tput sgr0)"
        exit 1
    fi
}

function assertWorkDirClean() {
    if ! git diff --exit-code > /dev/null \
        || git status --porcelain | grep '??'; then
        set +x
        echo "$(tput setab 1)ship abort. there are uncommitted changes in the working directory.$(tput sgr0)"
        exit 1
    fi
}

function assertGitClean() {
    assertIndexClean
    assertWorkDirClean
}

./clean.sh

assertGitClean

./build.sh

./test.sh

assertGitClean

./push.sh
