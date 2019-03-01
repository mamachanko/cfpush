#!/usr/bin/env bash -ex

cd $(dirname $0)

function ensureIndexClean() {
    if ! git diff --exit-code --cached > /dev/null; then
        set +x
        echo "$(tput setab 1)ship abort. there are uncommitted changes in the index.$(tput sgr0)"
        exit 1
    fi
}

function ensureWorkDirClean() {
    if ! git diff --exit-code > /dev/null \
        || git status --porcelain | grep '??'; then
        set +x
        echo "$(tput setab 1)ship abort. there are uncommitted changes in the working directory.$(tput sgr0)"
        exit 1
    fi
}

function ensureClean() {
    ensureIndexClean
    ensureWorkDirClean
}

function push() {
    git push
}

ensureClean

./destroy.sh

./deploy.sh

ensureClean

push

./destroy.sh
