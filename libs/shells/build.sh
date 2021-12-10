#!/usr/bin/env bash
rm  -rf   ./es
rm  -rf   ./lib
rm  -rf   ./dist



cpx ./public/fengmap.min.js ./node_modules/fengmap/build --clean

npm run build



cp ./types/index.d.ts  ./es
cp ./types/index.d.ts  ./lib
