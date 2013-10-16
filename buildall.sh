#!/bin/bash

if [ $# -eq 0 ]; then
 echo "Provide a valid version number to build!"
 exit 0
fi

sudo test
./macbuild.sh $1
./mac10.6build.sh $1
./winbuild.sh $1
./linbuild.sh $1
