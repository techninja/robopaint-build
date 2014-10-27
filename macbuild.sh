#!/bin/bash
echo "Clearing destination and copying Mac binaries..."
rm -rf out/mac && mkdir out/mac
rm out/RoboPaint-Mac-*.dmg
rm -rf tmp/ && mkdir tmp
cp -R nw-bin/mac/* out/mac
mv out/mac/node-webkit.app out/mac/RoboPaint.app

echo "Moving prebuilt final Robopaint files into Mac app..."
cp -R out/prebuild/robopaint out/mac/RoboPaint.app/Contents/Resources/app.nw/

echo "Outputting final DMG with included app file..."
echo "Creating dmg..."
dd if=/dev/zero of=out/RoboPaint-Mac-v$1.dmg bs=1M count=84 &&
echo "Formatting dmg..."
hformat -l RoboPaint out/RoboPaint-Mac-v$1.dmg &&
echo "Creating mount point..."
mkdir out/mac/temp &&
echo "Mounting dmg..."
sudo mount -t hfs -o loop out/RoboPaint-Mac-v$1.dmg out/mac/temp/ &&
echo "Moving files..."
sudo mv -v out/mac/RoboPaint.app out/mac/temp/ &&
echo "Unmounting dmg..."
sudo umount out/mac/temp &&

#echo "Cleaning up workspace..."
rm -rf out/mac

echo "Done! Final Mac release file build complete."


