#!/bin/bash
echo "Clearing destination and copying Linux binaries..."
rm -rf out/linux && mkdir out/linux
rm out/robopaint-linux*.zip
cp nw-bin/linux/* out/linux

echo "Adding prebuilt RoboPaint files to folder..."
cp -R out/prebuild/robopaint out/linux/

echo "Creating final Linux NW file..."
cd out/linux/robopaint
zip -0qr ../robopaint.nw ./* &&
cd ../../../

echo "Combining NW executable with Linux nw binary..."
cat nw-bin/linux/nw out/linux/robopaint.nw > out/linux/nw


echo "Cleaning up folder to zip..."
rm -rf out/linux/robopaint
rm out/linux/robopaint.nw
mv out/linux/nw out/linux/robopaint

echo "Outputting final ZIP..."
mv out/linux out/robopaint
cd out
zip -mqr robopaint-linux-v$1.zip robopaint
cd ..

echo "Done! Final Linux release file build complete."

