#!/usr/bin/env bash

mkdir -p dist
./node_modules/browserify/bin/cmd.js ./src/reactiveStore.js -o ./dist/reactiveStore.js
./node_modules/uglify/bin/uglify -s ./dist/reactiveStore.js -o ./dist/reactiveStore.min.js
