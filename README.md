Internetofthingsapp
===================
To run this application, the Arduino IDE will have to be installed on the server computer. The circuitboard is connected to the computer
via a USB 2.0 cable. The serial port is /dev/ttyUSB0 and baud rate 9600 bps. The measured values will be written onto a text file (sensordata.txt)
by a C file, named SerialRead.c. This will be read by the JavaScript code in the HTML files used for temperature, humidity and luminosity. 

To run the C file, the following command will have to be written on the terminal:
 sudo ./a.out /dev/ttyUSB0 9600
