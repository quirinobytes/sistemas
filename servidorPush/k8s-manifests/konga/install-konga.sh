#!/bin/bash

if [ ! -n "$1" ]; then
  echo -en "\n\t [INFO] Passar o$red NAMESPACE$normal como primeiro parametro para instalacao:\n Ex: $> install-kong.sh kube-system \n"
  exit 1
fi


echo Desinstalando KONGA caso exista...
helm delete konga -n $1
echo -en "\n\n Instalando no namespace $alert$1$normal\n"
listras.sh
helm install konga ./ -n $1 -f values.yaml


echo -en "$yellow \n\t\t[INFO]\n Nao esqueca de criar [$red usuário/database$normal] no Postgres \n"
echo "root@server $> psql -U postgres"
echo "postgres $> CREATE USER konga WITH PASSWORD 'xxx';"
echo "postgres $> CREATE DATABASE konga;"
echo "postgres $> GRANT ALL PRIVILEGES ON DATABASE konga TO konga;"
echo "postgres $> \l          [list databases]"
echo -en "postgres $> quit $normal\n "


