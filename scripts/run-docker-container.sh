#!/usr/bin/env bash

# Creates a container to run the puppeteer script that will setup the provide confluence instance in an unsupervised way
cd "$(dirname "$0")"/..
echo $PWD
docker run --rm \
    -v $PWD/screenshots:/app/screenshots \
    --name testcafe-confluence-setup \
    -e PPTR_CONFLUENCE_BASE_URL=http://confluence:8090/confluence \
    --network docker-confluence-for-testing_confluence-net \
    testcafe-confluence-setup