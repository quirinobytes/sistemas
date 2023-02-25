#!/bin/bash -x

# Config
ERROR_FLAG=0

function flag_update (){

	if [ $ERROR_FLAG == 0 ]; then
	    if [ $1 != 0 ]; then
		  ERROR_FLAG=$1
		  echo "Flag atualizada com $1"
	    fi
	fi
	echo "Flag com $1"
}

 if [ -e /etc/os-release ]; then

            cat /etc/os-release | grep -i Centos -q
            if [ $? == 0 ]; then
                  echo -en "$green ** $atention Centos -$yellow like found $green ** $normal\n\n"
            	systemctl stop servidorpush
			cp servidorpush.service.Centos /etc/systemd/system/servidorpush.service -f
			systemctl daemon-reload
			#systemctl start servidorpush
			exit 0
		fi

		cat /etc/os-release | grep Zorin -q
            if [ $? == 0 ]; then
                  echo -en "$green ** $atention DEBIAN -$yellow like found $green ** $normal\n\n"
			systemctl stop servidorpush
			cp servidorpush.service.Debian /etc/systemd/system/servidorpush.service  -f
			systemctl daemon-reload
			systemctl start servidorpush
			exit 0
            fi

		cat /etc/os-release | grep Ubuntu -q
            if [ $? == 0 ]; then
                  echo -en "$green ** $atention UBUNTU -$yellow like found $green ** $normal\n\n"
			systemctl stop servidorpush 
			flag_update $? 
			cp servidorpush.service.Ubuntu /etc/systemd/system/servidorpush.service  -f && flag_update $?
			systemctl daemon-reload && flag_update $?
			systemctl start servidorpush && flag_update $?
			if [ $ERROR_FLAG == 0 ]; then
			    echo -en "\n\n $alert $green Serviço $WHITE servidorpush $green instalado com sucesso !!! $normal\n\n"
			else 
			    echo -en "\n\n $alert $red (X) ERRO - Serviço $WHITE servidorpush $red não instalado !!! $normal\n\n"
			fi
			exit $ERROR_FLAG
            fi
            
            cat /etc/os-release | grep opensuse -qi
            if [ $? == 0 ]; then
                  echo -en "$green ** $atention OpenSuSE -$yellow like found $green ** $normal\n\n"
			systemctl stop servidorpush
			cp servidorpush.service.Opensuse /etc/systemd/system/servidorpush.service  -f
			systemctl daemon-reload
			systemctl start servidorpush
			exit 0
            fi


		echo -en "TEM arquivo /etc/os-release  mas FLAVOR desconhecido\n\n"

else
          echo -en "\n\n $red Nao foi possível determinar o S.O.$normal \n\n"
          echo -en "$alert(X) $red Saindo por nao determinar o FLAVOR $normal \n\n"
          exit 1
fi


