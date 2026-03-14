#!/bin/bash
npm run build

if [ ! -d 'performium' ]; then
  mkdir 'performium'
  echo 'Directory created: performium'
fi

mv build/main.js performium/main.js
cp styles.css performium/styles.css
cp manifest.json performium/manifest.json

echo 'Moved files to directory: performium'

rmdir 'build'

echo 'Directory removed: build'
echo 'Build Successful'