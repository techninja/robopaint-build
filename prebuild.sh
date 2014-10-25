#!/bin/bash
echo "Clearing destination..."
rm -rf out/prebuild && mkdir out/prebuild

echo "Pulling latest RoboPaint master branch..."
wget https://github.com/evil-mad/robopaint/archive/master.zip -qO out/prebuild/robopaint.zip
unzip -q out/prebuild/robopaint.zip -d out/prebuild
rm out/prebuild/robopaint.zip
mv out/prebuild/robopaint-master out/prebuild/robopaint
sed -i 's/"toolbar": true/"toolbar": false/g' out/prebuild/robopaint/package.json
sed -i 's/"stage": "development"/"stage": "release"/g' out/prebuild/robopaint/package.json

echo "Installing RoboPaint dependencies..."
cd out/prebuild/robopaint/
npm install --production --silent

echo "GO on a diet! Removing extra fat from build..."
rm -rf resources/modes/edit/method-editor/build/
rm -rf resources/modes/edit/method-editor/docs/
rm -rf resources/modes/edit/method-editor/method-draw/
rm -rf resources/modes/edit/method-editor/test/

cd ../../../


echo "Copying native build components for Windows, Linux & OSX..."
cp -R native_builds/serialport out/prebuild/robopaint/node_modules/cncserver/node_modules/serialport/build

echo "Prebuild complete!"

