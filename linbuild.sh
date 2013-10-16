#!/bin/bash
echo "Clearing destination and copying Linux binaries..."
rm -rf out/linux && mkdir out/linux
rm out/robopaint-lin.zip
cp nw-bin/linux/* out/linux

echo "Pulling latest RoboPaint master branch..."
wget https://github.com/evil-mad/robopaint/archive/master.zip -qO out/linux/robopaint.zip
unzip -q out/linux/robopaint.zip -d out/linux
rm out/linux/robopaint.zip
mv out/linux/robopaint-master out/linux/robopaint

echo "Pulling latest CNC server master branch..."
mkdir out/linux/robopaint/node_modules
wget https://github.com/techninja/cncserver/archive/master.zip -qO out/linux/cncserver.zip
unzip -q out/linux/cncserver.zip -d out/linux/robopaint/node_modules
mv out/linux/robopaint/node_modules/cncserver-master out/linux/robopaint/node_modules/cncserver

echo "Copying over CNC server compiled Linux node modules..."
mkdir out/linux/robopaint/node_modules/cncserver/node_modules
cp -R node_modules/linux/* out/linux/robopaint/node_modules/cncserver/node_modules

echo "Creating final Linux NW file..."
cd out/linux/robopaint
zip -0qr ../robopaint.nw ./* &&
cd ../../../

echo "Combining NW executable with Linux nw binary..."
cat nw-bin/linux/nw out/linux/robopaint.nw > out/linux/nw


echo "Cleaning up folder to zip..."
rm out/linux/cncserver.zip
rm -rf out/linux/robopaint
rm out/linux/robopaint.nw
mv out/linux/nw out/linux/robopaint

echo "Outputting final ZIP..."
mv out/linux out/robopaint
cd out
zip -mqr robopaint-linux-v$1.zip robopaint
cd ..

echo "Done! Final Linux release file build complete."

