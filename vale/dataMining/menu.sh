#!/bin/bash
# tia.sh - o script da tia que precisa usar o computador
# Este script faz parte do http://aurelio.net/shell/dialog
#
# Exemplo de como amarrar o script num menu principal usando
# o 'while'. O 'case' é usado para identificar qual foi a ação
# escolhida. Após cada ação, ele sempre retorna ao menu
# principal. Só sai do script caso escolha a última opção,
# aperte CANCELAR ou ESC.
#
# Útil para usar como login shell de pessoas inexperientes ou
# fazer utilitários de ações restritas e definidas.
#
# FLUXOGRAMA
#                      INÍCIO                    FIM
#                   +-----------+            +----------+
#          +------> |    menu   |--Esc-----> |  sai do  |
#          |        | principal |--Cancel--> | programa |
#          |        +-----Ok----+       +--> +----------+
#          |              |             |
#          +--<--1 2 3-4--+--Zero--->---+
#

# Loop que mostra o menu principal
while : ; do

    # Mostra o menu na tela, com as ações disponíveis
    resposta=$(
      dialog --stdout               \
             --title 'Menu da Tia'  \
             --menu 'Oi Tia, escolha o quê você quer fazer:' \
            0 0 0                   \
            1 'Finance.sina.cn'	\
            2 'IBOSVEPA' 	 	\
            3 'DJI'    		 	\
            4 'CSNA3'     		\
            5 'Rio Tinto' 		\
            6 'BHP'     		\
            7 'Mining...'     		\
            0 'Sair'                )

    # Ela apertou CANCELAR ou ESC, então vamos sair...
    [ $? -ne 0 ] && break

    # De acordo com a opção escolhida, dispara programas
    case "$resposta" in
         1) RESULT=`node /root/workspace/bolsa-systems/blueMoney/dataMining/commodities/iron/finance.sina.com.cn.js`  
				dialog \
                --cr-wrap \
                --backtitle 'Menu'   \
                --title 'finance.sina.cn getter' \
                --msgbox "\n\n Executado com sucesso:\n\n$RESULT" 20 100
				;;
         2) RESULT=`node /root/workspace/bolsa-systems/blueMoney/dataMining/bolsas/ibovespa/ibovespa.js`  
				dialog \
                --cr-wrap \
                --backtitle 'Menu'   \
                --title 'Ibovespa getter' \
                --msgbox "\n\n Executado com sucesso:\n\n$RESULT" 20 100
				;;

			3) RESULT=`node /root/workspace/bolsa-systems/blueMoney/dataMining/bolsas/dji/dji.js`  
				dialog \
                --cr-wrap \
                --backtitle 'Menu'   \
                --title 'DJI getter' \
                --msgbox "\n\n Executado com sucesso:\n\n$RESULT" 20 100
				;;

			4) RESULT=`node /root/workspace/bolsa-systems/blueMoney/dataMining/acoes/csna3/csna3.js`  
				dialog \
                --cr-wrap \
                --backtitle 'Menu'   \
                --title 'CSNA3 getter' \
                --msgbox "\n\n Executado com sucesso:\n\n$RESULT" 20 100
				;;
		
			5) RESULT=`node /root/workspace/bolsa-systems/blueMoney/dataMining/acoes/rio_tinto/rio_tinto.js`  
				dialog \
                --cr-wrap \
                --backtitle 'Menu'   \
                --title 'BHP executado' \
                --msgbox "\n\n Executado com sucesso:\n\n$RESULT" 20 100
				;;


			6) RESULT=`node /root/workspace/bolsa-systems/blueMoney/dataMining/acoes/bhp/bhp.js`  
				dialog \
                --cr-wrap \
                --backtitle 'Menu'   \
                --title 'BHP executado' \
                --msgbox "\n\n Executado com sucesso:\n\n$RESULT" 20 100
				;;
			
			7) /root/workspace/bolsa-systems/blueMoney/dataMining/mining.sh 2> /tmp/error.menu 1> /tmp/saida.menu &
					dialog                           \
			   	--title 'Mining financial data over internet to build dataset. \n Please, wait a moment...'      \
					--tailbox /tmp/saida.menu			\
				   40 100
					

				;;

         0) break ;;
    esac
done

# Mensagem final :)
stty sane
echo 'Wakeup Money!'
