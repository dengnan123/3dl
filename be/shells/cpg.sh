#!/usr/bin/env bash

rm -rf ./src/redash/entities 

npx typeorm-model-generator -h 192.168.10.93 -d postgres -p 5466 -u postgres -x 9XhNKZzybfI4iK4e1BN0r6IM89Xi3zaV  -e postgres -o ./src/redash/entities --noConfig true  --ce pascal