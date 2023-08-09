#!/bin/sh
docker pull err0io/agent:latest && \
docker run --rm --mount type=bind,source=`pwd`,destination=/mnt err0io/agent:latest \
/usr/local/bin/err0agent.sh --token-file /mnt/err0-boxyhq-audit-logs-demo-demo-d3719f1d-3686-11ee-bcdf-0242ac110002.json --check --git-dir /mnt