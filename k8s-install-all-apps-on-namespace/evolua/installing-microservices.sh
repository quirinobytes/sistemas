#!/bin/bash

#################################################
# Bash script - Modelo					#
# Use como modelo para criar seus scripts bash. #
# v_1.0.1							#
#################################################
VERSION=1.0

#############     CONFIG     ####################
# Obs: Cuidado com a variavel NAMESPACE do      #
#      kubernetes sendo setada nesse .export.   #
#                                               #
# Carregando variáreis de ambiente.             #
source ~/.export                                #
#                                               #
# Carregando suporte a cores.                   #
source ~/.colors.sh                             #
#                                               #
#################################################


##########     Functions  #######################
function help(){
    echo -en "$\n\n\t $alert Use: $green $0 $PARAMETERS $normal \n\n"
}

function versao(){
    echo -en "$\n\n\t $alert Versao: $green $0 $VERSION $normal \n\n"
}

function hasParams(){
      echo "Verificando se existem parametros"
      if [ $# -lt 1 ]; then
            echo -en "$yellow Faltou utilizar pelo menos um argumento! $normal\n"
            return 1
      fi
     
      echo -en "Numero de argumentos: [$yellow$#$normal]\n"
     
      COUNT=0
      for ARG in $*; do
         COUNT=`expr $COUNT + 1`
         echo -en "Argumento [$COUNT]: $WHITE $ARG $normal"
      done
}

################################################
###############      MAIN       ################
###############     PROGRAM     ################
################################################

case $1 in
	      # Chamando help
		"-h"| "--help" )	
			help
		;;

	      # Exibindo versao do programa
            "-v"|"--version")
			versao
            ;;

            # Somente o comando, sem nenhum parametro.
		"" )	
			hasParams $*
		;;


            # Executa com opcao que nao tem.
		"-i","--install" )
                  create-ns
		;;
esac


################################################
#############    LOG          |  ###############
#############      EXAMPLES   o  ###############
################################################


echo -en "$INFO Deseja INFORMACOES? $1 ?\n\n"
echo -en "$WARN Deseja AVISOS? $1 ?\n\n"
echo -en "$ERRO Deseja ERROS? $1 ?\n\n"


################################################
#############    END          |  ###############
#############      MAIN       |  ###############
#############        PROGRAM  o  ###############
################################################
