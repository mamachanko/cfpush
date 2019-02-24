#!/usr/bin/env bash -ex

cd $(dirname $0)

./destroy.sh
./deploy.sh

cd ..
git push
