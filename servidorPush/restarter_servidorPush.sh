#!/bin/bash

function startar(){
 NODE_PATH=/lib/node_modules
 cd /root/sistemas/servidorPush
 /usr/bin/node servidorPush.js &
}

PID=$(pgrep -f "/usr/bin/node servidorPush.js")

if [ -z $PID ]; then
  startar
else
  kill -9 $PID
  startar
fi


