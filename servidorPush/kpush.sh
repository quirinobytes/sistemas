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

  echo -en "    $WHITE$yellow$L1\n"
  echo -en "    | $blue$1$yellow |\n"
  echo -en "    $L3$normal\n"
}

printTable "Building..."
cp /evolua.key .
docker build . -t quirinobytes/evolua
rm evolua.key
printTable "Pushing ..."
docker push quirinobytes/evolua | tee /tmp/dockerpush.txt

printTable "Applying..."
NEW_VERSION=$(cat /tmp/dockerpush.txt | grep "latest: digest" | awk '{print $3}')
echo -en "$WHITE Atualizando o HASH [$NEW_VERSION] no deployment.yaml $normal\n"
if [ "$NEW_VERSION" == "" ]; then
  echo -en "$red[ERROR]$normal NEW_VERSION vazia.\n"
  exit 1
fi
sed -i "s/evolua@.*$/evolua@$NEW_VERSION/g" k8s-manifests/deployment.yaml
cd k8s-manifests
kaf.sh | realce.awk configured | tee /tmp/kaf.txt
cd -

#vendo se tem alguma modificação para aguardar o POD subir.
grep -q configured /tmp/kaf.txt

if [ $? != 0 ]; then
  rm /tmp/kaf.txt /tmp/dockerpush.txt
  echo -en "\n\n\t $alert Não houve alteração nos manifestos.$normal \n\n"
  printTable "Finalizado!"
  exit 1
fi

printTable "Pulling..."
while(true); do 
      k_get.sh pods | tee > /tmp/pods.txt
      cat /tmp/pods.txt | grep $NAMESPACE | awk '{ print $1 $3}' | grep ContainerCreating
      if [ $? == 0 ]; then
      NOVO_POD=$(cat /tmp/pods.txt | grep $NAMESPACE | grep ContainerCreating | awk '{print $1}')
      echo -en "$yellow Aguardando o pod entrar em estado: [Running] ...$normal\n"
        while(true); do
          k_get.sh pods | tee > /tmp/pods.txt
          cat /tmp/pods.txt | grep $NOVO_POD | grep Running

          if [ $? == 0 ]; then
                rm /tmp/pods.txt
                listras.sh
                echo -en "\n\t[SUCCESS] Novo container$WHITE [$NOVO_POD]$normal criado com$green sucesso!$normal\n\n"
                listras.sh
                echo
                printTable "[🏆] Released -> K8S!" 
                exit 0
          fi
          sleep 1
        done
      fi
      sleep 1
done
