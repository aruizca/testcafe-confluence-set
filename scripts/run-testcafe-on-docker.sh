#!/usr/bin/env bash

# Set current folder to where the Dockerfile is
cd "$(dirname "$0")"/..

docker run --rm \
       -v $PWD/src/main:/src/main \
       -v $PWD/screenshots:/screenshots \
       --name testcafe-confluence-setup \
       --network docker-confluence-for-testing_confluence-net \
       testcafe/testcafe firefox /src/main/confluence-setup.js