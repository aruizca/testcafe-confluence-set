#!/usr/bin/env bash

# Set current folder to where the Dockerfile is
cd "$(dirname "$0")"/..

docker run --rm \
       -v $PWD/.:/app \
       -e PPTR_CONFLUENCE_BASE_URL=http://confluence:8090/confluence \
       --name testcafe-confluence-setup \
       --network docker-confluence-for-testing_confluence-net \
       testcafe/testcafe --config-file /app/.testcaferc.json firefox:headless /app/src/main/confluence-setup.ts