#!/bin/bash

if [ ! -n "$1" ]; then
  echo -en "\n\t [INFO] Passar o$red NAMESPACE$normal como primeiro parametro para instalacao:\n Ex: $> install-kong.sh kube-system \n"
  exit 1
fi


echo Desinstalando kong caso exista...
helm delete kong -n $1
echo -en "\n\n Instalando no namespace $alert$1$normal\n"
helm install kong kong/kong -n $1 -f values.yaml


echo -en "$yellow \n\t\t[INFO]\n Nao esqueca de criar [$red usuário/database$normal] no Postgres \n"
echo "root@server $> psql -U postgres"
echo "postgres $> CREATE USER kong WITH PASSWORD 'xxx';"
echo "postgres $> CREATE DATABASE kong;"
echo "postgres $> GRANT ALL PRIVILEGES ON DATABASE kong TO kong;"
echo "postgres $> \l          [list databases]"
echo -en "postgres $> quit $normal\n "


