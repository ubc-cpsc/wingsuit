#bash

yarn build
rsync -avu --exclude .git/ --exclude .nojekyll --exclude images/ --exclude videos/ --delete "out/" "../../wingsuit-designsystem.github.io/"
cd "../../wingsuit-designsystem.github.io/"
date=$(date '+%Y-%m-%d')
git add .
git commit -a -m "Deployment: $date"
git push