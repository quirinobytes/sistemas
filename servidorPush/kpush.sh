#!/bin/bash 

trap reiniciarKpush 3

function reiniciarKpush(){
  listras.sh
  echo [crtl+\] Reiniciando kpush
  listras.sh
  kpush.sh
  if [ $? -eq 1 ]; then
    echo HORA DE SAIR
    exit 1
  fi
}


NAMESPACE=evolua
IMAGE_NAME=evolua
REGISTRY_SERVER=hp.antidrone.com.br

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

  listras.sh
  echo -en "      $WHITE$yellow$L1\n"
  echo -en "  ✴   | $blue$1$yellow |  ✴ \n"  
  echo -en "      $L3$normal\n"
}


function kubernetesPush(){

  printTable "Building..."
  cp /evolua.key .
  docker build . -t $REGISTRY_SERVER/$IMAGE_NAME
  rm evolua.key
  printTable "Pushing ..."
  docker push $REGISTRY_SERVER/$IMAGE_NAME | tee /tmp/dockerpush.txt

  printTable "Applying..."
  NEW_VERSION=$(cat /tmp/dockerpush.txt | grep "latest: digest" | awk '{print $3}')
#NEW_VERSION=dhahjk

  if [ "$NEW_VERSION" == "" ]; then
    echo -en "$red❌[ERROR]$normal Valor do HASH da imagem veio vazio.\n"
    exit 1
  fi
  echo -en "${WHITE}Atualizando o HASH [$NEW_VERSION] no deployment.yaml $normal\n"
  sed -i "s/evolua@.*$/evolua@$NEW_VERSION/g" k8s-manifests/deployment.yaml
  cd k8s-manifests
  kaf.sh | realce.awk configured | tee /tmp/kaf.txt
  cd -

#vendo se tem alguma modificação nos YAML para aguardar o POD subir.
  grep -q configured /tmp/kaf.txt

  if [ $? != 0 ]; then
    echo -en "\n\n\t\t  $alert[☹ ]$normal  $alert Não houve alteração nos manifestos $normal  $alert[☹ ]$normal \n\n\n"
    printTable "Release cancelada!"
    exit 1
  fi

  printTable "Pulling..."
  while(true); do 
        k_get.sh pods > /tmp/pods.txt
        cat /tmp/pods.txt | grep $NAMESPACE | grep -iE 'ContainerCreating|Invalid'
        echo

        if [ $? == 0 ]; then
              listras.sh
              sleep 2
              NOVO_POD=$(cat /tmp/pods.txt | grep -E 'ContainerCreating|Invalid' | awk '{print $1}' )
              echo -en "${yellow}Aguardando o pod entrar em estado: [Running] ...$normal\n"
              
              while(true); do
                    k_get.sh pods > /tmp/pods.txt
                    cat /tmp/pods.txt | grep -i "$NOVO_POD" | grep -E 'Running|Invalid'

                    if [ $? == 0 ]; then
                          STATUS=$(kubectl get pods $NOVO_POD -n $NAMESPACE --no-headers=true | awk '{print $3}')
                          if [[ "$STATUS" =~ 'Running' ]]; then 

                                echo -en "\n\t[SUCCESS] Novo container$WHITE [$NOVO_POD]$normal criado com$green sucesso!$normal\n\n"
                                echo
                                printTable "[🏆] Released -> K8S!"
                                echo
                                echo -en "\n - Chamando $alert[k po]$normal para acompanhar o $yellow kpush$normal\n" 
                                echo -en "\n   $> $alert[crtl+\]$normal para um novo $red deploy$normal\n" 
                                listras.sh
                                #k_get.sh po
                                k_get.sh po || exit 1

                                exit 0
                          elif [[ "$STATUS" =~ 'Invalid' ]]; then
                                echo
                                printTable "[ERROR] Pod status: $STATUS"
                                echo
                                exit 1
                          fi
                    fi
                    sleep 1
              done
        fi
        sleep 1
  done
}


kubernetesPush


