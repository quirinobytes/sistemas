#!/bin/bash

export NAMESPACE=evolua

function printTable(){
  L1=""
  L3=""
  WORD=$1
  TAMANHO=${#WORD}
  ESPACO=$(($TAMANHO+6))
  
  for ((c=1;c<$ESPACO-1;c=$c+1)) ; do
        L1=$(echo -en  "$L1-")
        L3=$(echo -en "$L3-")
  done

  echo -en "      $WHITE$yellow$L1\n"
  echo -en "  ✴   | $blue$1$yellow |  ✴ \n"  
  echo -en "      $L3$normal\n"
}

printTable "Building..."
cp /evolua.key .
docker build . -t quirinobytes/evolua
rm evolua.key
printTable "Pushing ..."
#docker push quirinobytes/evolua | tee /tmp/dockerpush.txt

printTable "Applying..."
NEW_VERSION=$(cat /tmp/dockerpush.txt | grep "latest: digest" | awk '{print $3}')
NEW_VERSION=" "
if [ "$NEW_VERSION" == "" ]; then
  echo -en "$red❌[ERROR]$normal Valor do HASH da imagem veio vazio.\n"
  exit 1
fi
echo -en "$WHITE Atualizando o HASH [$NEW_VERSION] no deployment.yaml $normal\n"
sed -i "s/evolua@.*$/evolua@$NEW_VERSION/g" k8s-manifests/deployment.yaml
cd k8s-manifests
kaf.sh | realce.awk configured | tee /tmp/kaf.txt
cd -

#vendo se tem alguma modificação para aguardar o POD subir.
grep -q configured /tmp/kaf.txt

if [ $? != 0 ]; then
#  rm /tmp/kaf.txt /tmp/dockerpush.txt
  echo -en "\n\n\t\t  $alert[☹ ]$normal  $alert Não houve alteração nos manifestos $normal  $alert[☹ ]$normal \n\n\n"
  printTable " Release cancelada!"
  exit 1
fi

printTable "Pulling..."
while(true); do 
      k_get.sh pods | tee > /tmp/pods.txt
      cat /tmp/pods.txt | grep $NAMESPACE | awk '{ printf "$1\t $3"}' | grep -e 'ContainerCreating|InvalidImageName'
      if [ $? == 0 ]; then
            NOVO_POD=$(cat /tmp/pods.txt | grep $NAMESPACE | grep -e 'ContainerCreating|InvalidImageName' | awk '
                  BEGIN{  ALERT="\033[44;33;1m";  YELLOW="\033[33m";  NORMAL="\033[0;0m"; }
                  {print "Pod: " YELLOW $1" \t ->   "NORMAL "[" ALERT " "$3 NORMAL "]"}
            ')
            echo -en "$yellow Aguardando o pod entrar em estado: [Running] ...$normal\n"
            while(true); do
                  k_get.sh pods | tee > /tmp/pods.txt
                  cat /tmp/pods.txt | grep $NOVO_POD | grep -e 'Running|InvalidImageName'

                  if [ $? == 0 ]; then
##                      rm /tmp/pods.txt
                        listras.sh
                        STATUS=$(kubectl get pod $NOVO_POD)
                        if [ $STATUS =~ 'Running' ]; then 

                              echo -en "\n\t[SUCCESS] Novo container$WHITE [$NOVO_POD]$normal criado com$green sucesso!$normal\n\n"
                              listras.sh
                              echo
                              printTable "[🏆] Released -> K8S!"
                              echo
                              exit 0
                        elif [ $STATUS =~ 'InvalidImageName' ]; then
                              listras.sh
                              echo
                              printTable "[ERROR] Pod status: InvalidImageName"
                              echo
                              exit 1
                        fi
                  fi
                  sleep 1
            done
      fi
      sleep 1
done
