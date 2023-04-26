#!/bin/bash

if [ ! -n "$1" ]; then
  echo -en "\n\t [INFO] Passar o$red NAMESPACE$normal como primeiro parametro para instalacao:\n Ex: $> install-mongodb.sh <NAMESPACE> \n"
  exit 1
fi


echo Desinstalando MongoDB caso exista...
helm delete mongodb -n $1
echo -en "\n\n Instalando no namespace $alert$1$normal\n"
listras.sh
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install mongodb bitnami/mongodb -n $1 --create-namespace
listras.sh
echo -en "$yellow \n\t\t[INFO]\n Nao esqueca de criar [$red usuário/database$normal] no Postgres \n"
echo -en "postgres $> \l          [list databases]\n"
echo -en "postgres $> quit $normal\n "



