#!/bin/bash

# Config
ERROR_FLAG=0

function flag_update (){

	if [ $ERROR_FLAG == 0 ]; then
	    if [ $1 != 0 ]; then
		  ERROR_FLAG=$1
		  echo "Flag atualizada com $1"
	    fi
	fi
}

 if [ -e /etc/os-release ]; then

            cat /etc/os-release | grep CentOS -q
            if [ $? == 0 ]; then
                  echo -en "$green ** $atention RED HAT -$yellow like found $green ** $normal\n\n"
            	systemctl stop servidorPush
			cp servidorPush.service.Redhat /etc/systemd/system/servidorPush.service -f
			systemctl daemon-reload
			systemctl start servidorPush
			exit 0
		fi

		cat /etc/os-release | grep Zorin -q
            if [ $? == 0 ]; then
                  echo -en "$green ** $atention DEBIAN -$yellow like found $green ** $normal\n\n"
			systemctl stop servidorPush
			cp servidorPush.service.Debian /etc/systemd/system/servidorPush.service  -f
			systemctl daemon-reload
			systemctl start servidorPush
			exit 0
            fi

		cat /etc/os-release | grep Ubuntu -q
            if [ $? == 0 ]; then
                  echo -en "$green ** $atention UBUNTU -$yellow like found $green ** $normal\n\n"
			systemctl stop servidorPush && flag_update $?
			cp servidorPush.service.Ubuntu /etc/systemd/system/servidorPush.service  -f && flag_update $?
			systemctl daemon-reload && flag_update $?
			systemctl start servidorPush && flag_update $?
			if [ $ERROR_FLAG == 0 ]; then
			    echo -en "\n\n $alert $green Serviço $WHITE servidorpush $green instalado com sucesso !!! $normal\n\n"
			else 
			    echo -en "\n\n $alert $red (X) ERRO - Serviço $WHITE servidorpush $red não instalado !!! $normal\n\n"
			fi
			exit $ERROR_FLAG
            fi


		echo -en "TEM arquivo /etc/os-release  mas FLAVOR desconhecido\n\n"

else
          echo -en "\n\n $red Nao foi possível determinar o S.O.$normal \n\n"
          echo -en "$alert(X) $red Saindo por nao determinar o FLAVOR $normal \n\n"
          exit 1
fi


