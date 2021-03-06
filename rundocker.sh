#!/bin/bash

TAG=latest

docker run \
  -e "FOUNTAIN_ACCESS_KEY_ID=$FOUNTAIN_ACCESS_KEY_ID" \
  -e "FOUNTAIN_SECRET_ACCESS_KEY=$FOUNTAIN_SECRET_ACCESS_KEY" \
  -e "FOUNTAIN_BITTREX_API_SECRET=$FOUNTAIN_BITTREX_API_SECRET" \
  -e "FOUNTAIN_BITTREX_API_KEY=$FOUNTAIN_BITTREX_API_KEY" \
  -e "FOUNTAIN_COINBASE_API_KEY=$FOUNTAIN_COINBASE_API_KEY" \
  -e "FOUNTAIN_COINBASE_API_SECRET=$FOUNTAIN_COINBASE_API_SECRET" \
  fountain:$TAG

