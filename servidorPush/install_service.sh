#!/bin/bash -x

systemctl stop servidorPush
cp servidorPush.service /etc/systemd/system/ -f
systemctl daemon-reload
systemctl start servidorPush
#systemctl enable servidorPush

