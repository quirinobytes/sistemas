#!/bin/bash



function printTable(){

echo -en "$WHITE$yellow---------------\n"
echo -en "|$blue $1... $yellow|\n"
echo -en "---------------$normal\n"
}

printTable "Building"
cp /evolua.key .
docker build . -t quirinobytes/evolua
rm evolua.key

printTable "Pushing"
docker push quirinobytes/evolua | tee /tmp/dockerpush.txt

printTable "Applying"
NEW_VERSION=$(cat /tmp/dockerpush.txt | grep "latest: digest" | awk '{print $3}')
echo -en "$WHITE Atualizando o novo HASH no deployment.yaml $normal\n"
sed -i "s/evolua@.*$/evolua@$NEW_VERSION/g" k8s-manifests/deployment.yaml
cd k8s-manifests
kaf.sh | realce.awk configured
cd -

printTable "[OK] Released!"
while(true); do 
      k_get.sh pods | tee > /tmp/pods
      cat /tmp/pods | grep evolua | grep ContainerCreating
      if [ $? == 0 ]; then
      NOVO_POD=$(cat /tmp/pods | grep evolua | grep ContainerCreating | awk '{print $1}')
        while(true); do
          k_get.sh pods | tee > /tmp/pods
          cat /tmp/pods | grep $NOVO_POD | grep Running

          if [ $? == 0 ]; then
                listras.sh
                echo -en "\n\tNovo container$WHITE [$NOVO_POD]$normal criado com$green sucesso.\n"
                listras.sh
                exit 0
          fi
          sleep 1
        done
      fi
      sleep 1
done
