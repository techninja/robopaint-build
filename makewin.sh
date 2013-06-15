#!/bin/bash
echo "Clearing destination and copying Windows binaries..."
rm -rf out/windows && mkdir out/windows
rm out/robopaint-win.zip
rm -rf tmp/ && mkdir tmp
cp nw-bin/windows/* out/windows

echo "Pulling latest RoboPaint master branch..."
wget https://github.com/techninja/robopaint/archive/master.zip -qO out/windows/robopaint.zip
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

echo "Cleaning up folder to zip..."
rm out/windows/cncserver.zip
rm -rf out/windows/robopaint
rm out/windows/robopaint.nw

echo "Outputting final ZIP..."
mv out/windows out/robopaint
cd out
zip -mqr robopaint-win.zip robopaint
cd ..

echo "Done! Final Windows release file build complete."

