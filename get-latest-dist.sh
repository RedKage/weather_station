#!/bin/bash

echo "Downloading latest package..."
wget -q https://github.com/RedKage/weather_station/releases/latest/download/dist.zip
rc=$?

if [ $rc -eq 0 ]
then
  echo "- Backing up the current dist folder..."
  cp -f -r dist/ dist_old/

  echo "- Unzipping..."
  rm -r dist/
  mkdir dist/
  unzip dist.zip -d dist/ > /dev/null 2>&1

  echo "- Restoring old dist config..."
  cd dist_old
  find . -type f \
    -not -path "*/_nuxt/*" \
    -not -path "*/meteoblue/*" \
    -not -path "*/.nojekyll" \
    -not -path "*/200.html" \
    -not -path "*/favicon.ico" \
    -not -path "*/index.html" \
    | xargs -d '\n' cp -f --parents -t ../dist
  cd ..
  rm -r dist_old
  rm -f dist.zip

  echo "Done"
else
  echo "Something wrong with the download. Aborting."
fi
