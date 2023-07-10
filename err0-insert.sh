#!/bin/sh
docker pull err0io/agent:develop && \
docker run --rm --mount type=bind,source=`pwd`,destination=/mnt err0io/agent:develop \
/usr/local/bin/err0agent.sh --token-file /mnt/err0-retraced-demo-demo-64bfa498-1f2c-11ee-8e3c-0242ac110002.json --insert --git-dir /mnt
