# Microservices-using-apiconnect-and-appconnect

# Flow

# Pre-requisites
* [IBM Cloud Account](https://cloud.ibm.com)
* [Git Client](https://git-scm.com/downloads) - needed for clone commands.

# Steps

Follow these steps to setup and run this code pattern. The steps are described in detail below.

1. [Get the code](#1-get-the-code)

## 1. Get the code

- Clone the repo using the below command.
   ```
   git clone https://github.com/IBM/ngo-collaboration-using-blockchain
   ```
Create IBM Kubernetes Service

Get the public IP for Kubernetes Cluster

Deploy Mongo DB in container

cd mongodb
kubectl create -f deploy_mongodb.yaml

status can be checked as:
$ kubectl get pods
NAME                    READY   STATUS    RESTARTS   AGE
mongo-8dc7685d7-nxrcr   1/1     Running   0          73s

$ kubectl get services |grep mongo
mongo        NodePort    172.21.84.39   <none>        27017:32643/TCP   11m

Deploy Microservices

As explained in step xx, we are creating login, bank account management, credit and debit functionality as microservice. User credentials and bank account details will be pre-defined in Mongo DB. MongoDB deployed in a container is used by all the microservices.

Follow the steps to deploy microservices.

Update Cluster Public IP and Mongo Container service port : Execute the following command to update mongo db connection string in app.js related to all services.

sed command

**Deploy login microservice**
initialize DB - login
```
$ cd login_service
$ ibmcloud cr build -t us.icr.io/test_s1/login_app:v1.4 .
$ kubectl create -f deploy.yaml 

$ kubectl get services|grep login
login-service   NodePort    172.21.113.169   <none>        8080:32423/TCP    31s
```

**Deploy account_management service**
initialize DB - accountdetails
```
  cd account_management
  $ ibmcloud cr build -t us.icr.io/test_s1/account_details_app:v1.1 .
  $ kubectl create -f deploy.yaml 

  $ kubectl get services | grep acc
  account-details-service   NodePort    172.21.166.106   <none>        8080:32424/TCP    33s
```

**Deploy Debit service**
initialize DB - transaction log
```
  cd debit_service
  $ ibmcloud cr build -t us.icr.io/test_s1/debit_account_app:v1.2 .
  $ kubectl create -f deploy.yaml 

  $ kubectl get services |grep debit
  debit-account-service     NodePort    172.21.138.208   <none>        8080:32425/TCP    16s
```

**Deploy Credit service**
```
  cd credit_service
  $ ibmcloud cr build -t us.icr.io/test_s1/credit_account_app:v1.4 .
  $ kubectl create -f deploy.yaml 

  $ kubectl get services|grep credit
  credit-account-service    NodePort    172.21.51.254    <none>        8080:32426/TCP    11s
```

All services should be up and running.

## Learn More

<!-- keep this -->
## License

This code pattern is licensed under the Apache Software License, Version 2. Separate third-party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1 (DCO)](https://developercertificate.org/) and the [Apache Software License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache Software License (ASL) FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)

