#!/usr/bin/env bash -ex

cf target -s development -o cfpush-cloud

cf push

git push
