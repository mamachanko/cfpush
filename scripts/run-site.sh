#!/usr/bin/env bash

set -euxo pipefail

cd $(dirname $0)

cd ../site

# python -m SimpleHTTPServer 8081
docker \
    run \
    --rm \
    --name cfpush-site \
    --volume $(pwd):/usr/share/nginx/html:ro \
    --publish 8081:80 \
    nginx:1.15.9-alpine