if [ -z "$1" ]; then
  echo digite o nome do namespace para instalar o postgres
else
  kubectl create namespace $1
  kubectl apply -f postgres-storage.yaml -n $1
  kubectl apply -f postgres-configmap.yaml -n $1
  kubectl apply -f postgres-deployment.yaml -n $1
fi
