#!/bin/bash
echo "Clearing destination and copying Windows binaries..."
rm -rf out/windows && mkdir out/windows
rm out/Install_RoboPaint*.exe
cp nw-bin/windows/* out/windows

echo "Pulling latest RoboPaint master branch..."
wget https://github.com/evil-mad/robopaint/archive/master.zip -qO out/windows/robopaint.zip
unzip -q out/windows/robopaint.zip -d out/windows
rm out/windows/robopaint.zip
mv out/windows/robopaint-master out/windows/robopaint

echo "Pulling latest CNC server master branch..."
mkdir out/windows/robopaint/node_modules
wget https://github.com/techninja/cncserver/archive/master.zip -qO out/windows/cncserver.zip
unzip -q out/windows/cncserver.zip -d out/windows/robopaint/node_modules
mv out/windows/robopaint/node_modules/cncserver-master out/windows/robopaint/node_modules/cncserver

echo "Copying over CNC server compiled Windows node modules..."
mkdir out/windows/robopaint/node_modules/cncserver/node_modules
cp -R node_modules/windows/* out/windows/robopaint/node_modules/cncserver/node_modules

echo "Creating final Windows NW file..."
cd out/windows/robopaint
zip -0qr ../robopaint.nw ./* &&
cd ../../../

echo "Combining NW executable with Windows exe..."
cat nw-bin/windows/nw.exe out/windows/robopaint.nw > out/windows/nw.exe

echo "Compiling final NSIS installer file..."
cd installers/windows
makensis -V1 -DVERSION=$1 robopaint.nsi
cd ../../

echo "Cleaning up..."
rm -rf out/windows

echo "Done! Final Windows release install file completed."
