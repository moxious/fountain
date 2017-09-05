#!/bin/bash
echo "Fountain image starting"
# echo "JOB " $JOB
# echo "ARGS " $ARGS

DIST=/src/

# if [ -z "$JOB" ] ; then
#    echo "Missing JOB environment variable"
# else
  # Run compiled es5
  node $DIST/run/bittrexMarketFeed.js
# fi

echo "Fountain: Docker Image Finished"
