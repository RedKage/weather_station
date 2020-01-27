#!/bin/bash

echo "Fetching upstream info..."
git fetch origin --quiet

git diff master origin/master --quiet --exit-code
rc=$?

if [ $rc -eq 1 ]
then
  echo "Upstream changes detected"
  git pull --quiet

  echo "- Backing up the current dist folder..."
  cp -f -r dist/ dist_old/

  echo "- Rebuilding..."
  npm i > /dev/null 2>&1
  npm run generate > /dev/null 2>&1

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

  echo "Done"
else
  echo "Nothing to do"
fi
