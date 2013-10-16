#!/bin/bash
echo "Clearing destination and copying Mac binaries..."
rm -rf out/mac && mkdir out/mac
rm out/robopaint-mac.dmg
rm -rf tmp/ && mkdir tmp
cp -R nw-bin/mac/* out/mac
mv out/mac/node-webkit.app out/mac/RoboPaint.app

echo "Pulling latest RoboPaint master branch..."
wget https://github.com/evil-mad/robopaint/archive/master.zip -qO out/mac/robopaint.zip
unzip -q out/mac/robopaint.zip -d out/mac
rm out/mac/robopaint.zip
mv out/mac/robopaint-master out/mac/robopaint

echo "Pulling latest CNC server master branch..."
mkdir out/mac/robopaint/node_modules
wget https://github.com/techninja/cncserver/archive/master.zip -qO out/mac/cncserver.zip
unzip -q out/mac/cncserver.zip -d out/mac/robopaint/node_modules
mv out/mac/robopaint/node_modules/cncserver-master out/mac/robopaint/node_modules/cncserver

echo "Copying over CNC server compiled Mac node modules..."
mkdir out/mac/robopaint/node_modules/cncserver/node_modules
cp -R node_modules/mac/* out/mac/robopaint/node_modules/cncserver/node_modules

echo "GO on a diet! Removing extra fat from build..."
rm -rf out/mac/robopaint/resources/edit/
rm -rf out/mac/robopaint/resources/method-editor/build/
rm -rf out/mac/robopaint/resources/method-editor/docs/
rm -rf out/mac/robopaint/resources/method-editor/method-draw/
rm -rf out/mac/robopaint/resources/method-editor/test/


echo "Moving final Robopaint NW files into Mac app..."
mv out/mac/robopaint/ out/mac/RoboPaint.app/Contents/Resources/app.nw/
rm out/mac/cncserver.zip


echo "Outputting final DMG with included app file..."
echo "Creating dmg..."
dd if=/dev/zero of=out/robopaint-mac.dmg bs=1M count=82 &&
echo "Formatting dmg..."
hformat -l RoboPaint out/robopaint-mac.dmg &&
echo "Creating mount point..."
mkdir out/mac/temp &&
echo "Mounting dmg..."
sudo mount -t hfs -o loop out/robopaint-mac.dmg out/mac/temp/ &&
echo "Moving files..."
sudo mv -v out/mac/RoboPaint.app out/mac/temp/ &&
echo "Unmounting dmg..."
sudo umount out/mac/temp &&

#echo "Cleaning up workspace..."
rm -rf out/mac

echo "Done! Final Mac release file build complete."


