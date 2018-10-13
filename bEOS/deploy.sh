#!/bin/bash




cd /root/sistemas/bEOS/deploy
if [ $? == 0 ]; then
    echo -en "\n\n$atention Deploy done with $green success $normal \n\n"
	node deploy.js && exit 0 &
	sleep 3
	DEPLOY_PID=$(ps aux | grep "node deploy.js" | grep -v grep | grep deploy.js | awk '{ print $2} ')
	kill -9 $DEPLOY_PID
else
    echo -en "\n\n$alert $red (X) $WHITE Some error occured, $red not deployed to server $normal \n\n"
fi
