#!/bin/bash

PID=$(pgrep -f "/usr/bin/node servidorPush.js")
echo $PID

if [ -z "$PID" ]; then
  echo nao está rodando
  exit 0
else
  kill -9 $PID
  exit 0
fi
exit 1



