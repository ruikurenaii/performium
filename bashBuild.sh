#!/bin/bash
npm run build

if [ ! -d 'performium' ]; then
  mkdir 'performium'
fi

cp styles.css performium/styles.css
cp manifest.json performium/manifest.json
mv build/main.js performium/main.js

rmdir 'build'