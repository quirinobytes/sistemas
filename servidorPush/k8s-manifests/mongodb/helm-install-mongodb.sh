helm repo add bitnami https://charts.bitnami.com/bitnami

helm install mongodb-dev bitnami/mongodb -n mongodb --create-namespace
