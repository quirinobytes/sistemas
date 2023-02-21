#!/bin/bash

#################################################
# Bash script - Modelo					#
# Use como modelo para criar seus scripts bash. #
# v_1.0.1							#
#################################################
VERSION=1.0


#############     CONFIG     ####################
#Carrega variáreis de ambiente.
source ~/.export
# Suporte a cores no bash.
source ~/shell/colors.sh
################################################


##########  Funcao       #######################
function help(){
    echo -en "$\n\n\t $alert Use: $green $0 $PARAMETERS $normal \n\n"
}

function start(){
      NODE_PATH=/lib/node_modules
      cd /root/sistemas/servidorPush
      /usr/bin/node servidorPush.js
      

}
################################################
#############        MAIN       ################
case $1 in
		"ps" | "-p" | "--ps")	
			# opção ps ou -p ou --ps, faça isso... 
			ps aux ; echo "Digite os comandos aqui"
		;;


		"" )	
			start # Quando executa sem opcao, chama funcao versao acima.
		;;

		"-h"| "--help" )	
			# Quando executa com -h ou --help, chama funcao help.
			help
		;;

            "start"|"--start")
			start
            ;;

		* )
			# Executa com opcao que nao tem.
			echo -en "Verificando os parametros passados $red $* $normal se existe algum.\n"
			hasParams $*
		;;
esac
#############        FIM      ##################
################################################

