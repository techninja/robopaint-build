Version 2.0 of Drivers for all UBW-based products


* ReadMe.txt file

The USBDriverInstaller.exe will allow you to install or remove the drivers for your UBW based 
product (EiBotBoard - part of the EggBot Kit, UBW, UBW32, SDENET, UBW16, etc.) These drivers
are necessary for Windows to understand how to communicate with the board.


* Platforms Supported (for this driver - Mac OS and Linux do not need drivers):

Windows XP, Vista, Windows 7 and Windows 8. 32 and 64 bit versions of each are supported.


* Instructions for installing USB drivers:

1) With your board disconnected from your computer, run the USBDriverInstaller.exe
2) If the User Account Control asks if you want to run the application, click "Yes".
3) Click on the "Install Drivers" button.
4) If Windows Security complains that it can't verify the publisher of the driver,
click "Install this driver software anyway"
5) If Software Installation complains that "The software you are installing has not passed
Windows Logo testing . . .", then click "Continue Anyway".
6) Wait for message saying "Complete: Driver was pre-installed", then close the application.

Now the drivers are installed, so when you plug your board into your computer, Windows will either
not ask you for anything and just install the new device (Vista, Win7, Win8) or it will ask you to
find drivers and you can always just click on "Install the software automatically" 
and it will find the driver on its own. You may have to click "Continue Anyway" if it asks
about the drivers not being Windows Logo Certified.


* Support

If you have any questions, or find any problems with this software, please contact
Brian Schmalz at brian@schmalzhaus.com.

This application was developed by Microchip to support their PIC microcontrollers. It is contained
in the Microchip Application Library (MAL) which can be found at http://www.microchip.com/MAL


* Version History:

09/09/2010 : First published, with Microchip USB Stack v2.7a (v2010-08-04) MAL example, 
                added SchmalzHaus PID to INF file.
03/30/2013 : Second version, updated with INF from Microchip USB Stack v2.9i (v213-02-15).
                Added signed INF file for Win8 install.