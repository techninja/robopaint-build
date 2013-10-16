#!/bin/bash
echo "Clearing destination and copying Mac binaries..."
rm -rf out/mac10.6 && mkdir out/mac10.6
rm out/robopaint-mac10.6.dmg
rm -rf tmp/ && mkdir tmp
cp -R nw-bin/mac10.6/* out/mac10.6
mv out/mac10.6/node-webkit.app out/mac10.6/RoboPaint.app

echo "Pulling latest RoboPaint master branch..."
wget https://github.com/evil-mad/robopaint/archive/master.zip -qO out/mac10.6/robopaint.zip
unzip -q out/mac10.6/robopaint.zip -d out/mac10.6
rm out/mac10.6/robopaint.zip
mv out/mac10.6/robopaint-master out/mac10.6/robopaint

echo "Pulling latest CNC server master branch..."
mkdir out/mac10.6/robopaint/node_modules
wget https://github.com/techninja/cncserver/archive/master.zip -qO out/mac10.6/cncserver.zip
unzip -q out/mac10.6/cncserver.zip -d out/mac10.6/robopaint/node_modules
mv out/mac10.6/robopaint/node_modules/cncserver-master out/mac10.6/robopaint/node_modules/cncserver

echo "Copying over CNC server compiled Mac node modules..."
mkdir out/mac10.6/robopaint/node_modules/cncserver/node_modules
cp -R node_modules/mac10.6/* out/mac10.6/robopaint/node_modules/cncserver/node_modules

echo "GO on a diet! Removing extra fat from build..."
rm -rf out/mac10.6/robopaint/resources/method-editor/build/
rm -rf out/mac10.6/robopaint/resources/method-editor/docs/
rm -rf out/mac10.6/robopaint/resources/method-editor/method-draw/
rm -rf out/mac10.6/robopaint/resources/method-editor/test/


echo "Moving final Robopaint NW files into Mac app..."
mv out/mac10.6/robopaint/ out/mac10.6/RoboPaint.app/Contents/Resources/app.nw/
rm out/mac10.6/cncserver.zip


echo "Outputting final DMG with included app file..."
echo "Creating dmg..."
dd if=/dev/zero of=out/robopaint-mac10.6.dmg bs=1M count=80 &&
echo "Formatting dmg..."
hformat -l RoboPaint out/robopaint-mac10.6.dmg &&
echo "Creating mount point..."
mkdir out/mac10.6/temp &&
echo "Mounting dmg..."
sudo mount -t hfs -o loop out/robopaint-mac10.6.dmg out/mac10.6/temp/ &&
echo "Moving files..."
sudo mv -v out/mac10.6/RoboPaint.app out/mac10.6/temp/ &&
echo "Unmounting dmg..."
sudo umount out/mac10.6/temp &&

#echo "Cleaning up workspace..."
rm -rf out/mac10.6

echo "Done! Final Mac release file build complete."


