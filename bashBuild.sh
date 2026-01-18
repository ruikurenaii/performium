#!/bin/bash
npm run build

if [ ! -d 'performium' ]; then
  mkdir 'performium'
  echo 'Directory created: performium'
fi

cp styles.css performium/styles.css
cp manifest.json performium/manifest.json
mv build/main.js performium/main.js

echo 'Moved files to directory: performium'

rmdir 'build'

echo 'Directory removed: build'

function yes_or_no {
    while true; do
        read -p "$* [y/n]: " yn
        case $yn in
            [Yy]* ) return 0;;
            [Nn]* ) echo "Aborted" ; return 1;;
        esac
    done
}

if yes_or_no "Do you want to move the plugin and it's contents?"; then
    echo 'Moving the directory: performium'
    read -p 'Which directory? Directory: ' directory
    mv performium/* "$directory"
    echo "Moved directory to: $directory"
    rmdir 'performium'
    echo "Removed directory: performium"
else
    echo "Action skipped."
fi