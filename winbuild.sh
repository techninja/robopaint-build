#!/bin/bash
echo "Clearing destination and copying Windows binaries..."
rm -rf out/windows && mkdir out/windows
rm out/Install_RoboPaint*.exe
cp nw-bin/windows/* out/windows

echo "Adding prebuilt RoboPaint files to folder..."
cp -R out/prebuild/robopaint/* out/windows/

echo "Compiling final NSIS installer file..."
cd installers/windows
makensis -V1 -DVERSION=$1 robopaint.nsi
cd ../../

echo "Cleaning up..."
rm -rf out/windows

echo "Done! Final Windows release install file completed."
