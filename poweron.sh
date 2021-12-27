#!/bin/sh
echo "Power on"
case $1 in
    1)  echo 'PC 1'
        etherwake "MAC 1"
    ;;
    2)  echo 'PC 2'
        etherwake "MAC 2"
    ;;
    3)  echo 'PC 3'
        etherwake "MAC 3"
    ;;
    4)  echo 'PC 4'
    	etherwake "MAC 4"
    ;;
    *)  echo 'Err'
        echo $1
    ;;
esac