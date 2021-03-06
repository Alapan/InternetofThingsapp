#include <stdio.h>   /* Standard input/output definitions */
#include <string.h>  /* String function definitions */
#include <unistd.h>  /* UNIX standard function definitions */
#include <fcntl.h>   /* File control definitions */
#include <errno.h>   /* Error number definitions */
#include <termios.h> /* POSIX terminal control definitions */
#include <time.h>

int serialport_close( int fd )
{
    return close( fd );
}

// uncomment this to debug reads
//#define SERIALPORTDEBUG 

// takes the string name of the serial port (e.g. "/dev/ttyUSB1","COM1")
// and a baud rate (bps) and connects to that port at that speed and 8N1.
// opens the port in fully raw mode so you can send binary data.
// returns valid fd, or -1 on error
int serialport_init(const char* serialport, int baud)
{
    struct termios toptions;
    int fd;
    
    //fd = open(serialport, O_RDWR | O_NOCTTY | O_NDELAY);
    fd = open(serialport, O_RDWR | O_NONBLOCK );
    
    if (fd == -1)  {
        perror("serialport_init: Unable to open port ");
        return -1;
    }

    if (tcgetattr(fd, &toptions) < 0) {
        perror("serialport_init: Couldn't get term attributes");
        return -1;
    }

    speed_t brate = baud; // let you override switch below if needed

    switch(baud) {
    case 4800:   brate=B4800;   break;
    case 9600:   brate=B9600;   break;
#ifdef B14400
    case 14400:  brate=B14400;  break;
#endif
    case 19200:  brate=B19200;  break;
#ifdef B28800
    case 28800:  brate=B28800;  break;
#endif
    case 38400:  brate=B38400;  break;
    case 57600:  brate=B57600;  break;
    case 115200: brate=B115200; break;
    }
    cfsetispeed(&toptions, brate);
    cfsetospeed(&toptions, brate);

    // 8N1
    toptions.c_cflag &= ~PARENB;
    toptions.c_cflag &= ~CSTOPB;
    toptions.c_cflag &= ~CSIZE;
    toptions.c_cflag |= CS8;
    // no flow control
    toptions.c_cflag &= ~CRTSCTS;

    //toptions.c_cflag &= ~HUPCL; // disable hang-up-on-close to avoid reset

    toptions.c_cflag |= CREAD | CLOCAL;  // turn on READ & ignore ctrl lines
    toptions.c_iflag &= ~(IXON | IXOFF | IXANY); // turn off s/w flow ctrl

    toptions.c_lflag &= ~(ICANON | ECHO | ECHOE | ISIG); // make raw
    toptions.c_oflag &= ~OPOST; // make raw

    toptions.c_cc[VMIN]  = 0;
    toptions.c_cc[VTIME] = 0;
    
    tcsetattr(fd, TCSANOW, &toptions);
    if( tcsetattr(fd, TCSAFLUSH, &toptions) < 0) {
        perror("init_serialport: Couldn't set term attributes");
        return -1;
    }

    return fd;
}

int serialport_read_until(int fd, char* buf, char until, int buf_max, int timeout)
{
    char b[1];  // read expects an array, so we give it a 1-byte array
    int i=0;
    do { 
        int n = read(fd, b, 1);  // read a char at a time
        if( n==-1) return -1;    // couldn't read
        if( n==0 ) {
            usleep( 1 * 1000 );  // wait 1 msec try again
            timeout--;
            continue;
        }
#ifdef SERIALPORTDEBUG  
        printf("serialport_read_until: i=%d, n=%d b='%c'\n",i,n,b[0]); // debug
#endif
        buf[i] = b[0]; 
        i++;
    } while( b[0] != until && i < buf_max && timeout>0 );

    buf[i] = 0;  // null terminate the string
    return 0;
}

int main(int argc, char *argv[]) 
{
    const int buf_max = 256;
    
    char time_str[100];
    int fd = -1;
    char serialport[buf_max];
    int baudrate = 9600;  // default
    
    char eolchar = '\n';
    int timeout = 5000;
    char buf[buf_max];
    FILE *file;    

     if (argc==1) {
        printf("Usage: Serial read -b <bps> -p <serialport>\n");
    }

    strcpy(serialport,argv[1]);
    baudrate = atoi(argv[2]);

    if( fd!=-1 ) {
                serialport_close(fd);
                printf("closed port %s\n",serialport);
            }    
    fd = serialport_init(serialport, baudrate);
    
    while(1)
    {
        if( fd==-1 ) error("couldn't open port");
        memset(buf,0,buf_max);  // 
        memset(time_str, 0, 100);
        serialport_read_until(fd, buf, eolchar, buf_max, timeout);
        //printf("%s\n", buf);

    //--- write to the file to store the sensor data ---
        if(strstr(buf,"Polled to quick") == 0)
        {
            file = fopen( "sensordata.txt", "a+");
            time_t t = time(NULL);
            struct tm tm = *localtime(&t);
            sprintf(time_str, "time: %d-%02d-%02d %02d:%02d:%02d,",tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min, tm.tm_sec);
            fputs(time_str, file);
            fputs(buf, file);
            fclose (file);
        }
    }  
   return 0;
}
