#!/bin/bash 

NAMESPACE=evolua
IMAGE=peerserver
DOCKER_REGISTRY=hp.antidrone.com.br

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

printTable "Building..."
docker build . -t $DOCKER_REGISTRY/$IMAGE

printTable "Pushing ..."
docker push $DOCKER_REGISTRY/$IMAGE | tee /tmp/$IMAGE.dockerpush.txt

printTable "Applying..."
NEW_VERSION=$(cat /tmp/$IMAGE.dockerpush.txt | grep "latest: digest" | awk '{print $3}')

if [ "$NEW_VERSION" == "" ]; then
  echo -en "$red❌[ERROR]$normal Valor do HASH da imagem veio vazio.\n"
  exit 1
fi
echo -en "${WHITE}Atualizando o HASH [$NEW_VERSION] no deployment.yaml $normal\n"
sed -i "s/$IMAGE@.*$/$IMAGE@$NEW_VERSION/g" k8s-manifests/deployment.yaml
cd k8s-manifests
kaf.sh | realce.awk configured | tee /tmp/$IMAGE.kaf.txt
cd -

#vendo se tem alguma modificação nos YAML para aguardar o POD subir.
grep -q configured /tmp/$IMAGE.kaf.txt

if [ $? != 0 ]; then
  echo -en "\n\n\t\t  $alert[☹ ]$normal  $alert Não houve alteração nos manifestos $normal  $alert[☹ ]$normal \n\n\n"
  printTable "Release cancelada!"
  exit 1
fi

printTable "Pulling..."
while(true); do 
      k_get.sh pods > /tmp/$IMAGE.pods.txt
      cat /tmp/$IMAGE.pods.txt | grep $NAMESPACE | grep -iE 'ContainerCreating|Invalid'
      echo

      if [ $? == 0 ]; then
            listras.sh
            sleep 2
            NOVO_POD=$(cat /tmp/$IMAGE.pods.txt | grep -E 'ContainerCreating|Invalid' | awk '{print $1}' )
            echo -en "${yellow}Aguardando o pod entrar em estado: [Running] ...$normal\n"
            
            while(true); do
                  k_get.sh pods > /tmp/$IMAGE.pods.txt
                  cat /tmp/$IMAGE.pods.txt | grep -i "$NOVO_POD" | grep -E 'Running|Invalid'

                  if [ $? == 0 ]; then
                        STATUS=$(kubectl get pods $NOVO_POD -n $NAMESPACE --no-headers=true | awk '{print $3}')
                        if [[ "$STATUS" =~ 'Running' ]]; then 

                              echo -en "\n\t[SUCCESS] Novo container$WHITE [$NOVO_POD]$normal criado com$green sucesso!$normal\n\n"
                              echo
                              printTable "[🏆] Released -> K8S!"
                              echo
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
