#!/usr/bin/env bash -euxo pipefail

cd $(dirname $0)

trap ctrl_c INT

function ctrl_c() {
    echo "trapped ctrl-c"
    echo "removing nginx-docker.conf"
    rm nginx-docker.conf
}

cat nginx.conf \
    | sed 's/daemon off\;//' \
    | sed 's/{{port}}/80/' \
    > nginx-docker.conf

docker \
    run \
    --volume $(pwd)/nginx-docker.conf:/etc/nginx/nginx.conf:ro \
    --volume $(pwd)/public:/etc/nginx/public:ro \
    --publish 8080:80 \
    nginx:mainline-alpine