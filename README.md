# Microservices-using-apiconnect-and-appconnect

# Flow

# Pre-requisites
* [IBM Cloud Account](https://cloud.ibm.com)
* [Git Client](https://git-scm.com/downloads) - needed for clone commands.

# Steps

Follow these steps to setup and run this code pattern. The steps are described in detail below.

1. [Get the code](#1-get-the-code)
2. [Create IBM Cloud Services](#2-create-ibm-cloud-services)
3. Configure API Connect
4. Configure App Connect
5. Setup environment for Kubernetes CLI
6. [Deploy Mongo DB](#6-deploy-mongo-db)
7. [Deploy Microservices](#7-deploy-microservices)
8. Deploy webapp
9. Analyze the result

## 1. Get the code

- Clone the repo using the below command.
   ```
   git clone https://github.com/IBM/microservices-using-apiconnect-and-appconnect.git
   ```
   
## 2. Create IBM Cloud Services

**Create IBM Kubernetes Service**

Create a Kubernetes cluster with [Kubernetes Service](https://cloud.ibm.com/containers-kubernetes/catalog/cluster) using IBM Cloud Dashboard. This pattern uses the _free cluster_.

  ![](images/create_service.png)

  > Note: It can take up to 15-20 minutes for the cluster to be set up and provisioned.
  
  

## 5. Setup environment for Kubernetes CLI

  * Check the status of your cluster `IBM Cloud Dashboard -> Kubernetes Cluster -> <your cluster>`. If status is not `Normal`, then you need to wait for some more time to proceed further.
    
  * Once your cluster is ready, open the access tab `IBM Cloud Dashboard -> Kubernetes Cluster -> <your cluster> -> Access` as shown in snapshot.

    ![](images/access-to-cluster.png)
    
    Perform the steps provided under this section.
    
  * Verify that the kubectl commands run properly with your cluster by checking the Kubernetes CLI server version.

    ```
    $ kubectl version  --short
    Client Version: v1.9.2
    Server Version: v1.8.6-4+9c2a4c1ed1ee7e
    ```

 **Get the public IP for Kubernetes Cluster**
 
 Once cluster is up and running then find out the public IP of your cluster. It will be required for further steps.

  * Go to `IBM Cloud Dashboard -> Kubernetes Cluster -> <your cluster>`. It gives you details of the cluster.

  * Access `Worker Nodes` tab, it will show you the public IP of your cluster as shown in below screenshot.

    ![](images/worker-nodes.png)
  
   Make a note of this public IP. It will be used in next step.

## 6. Deploy Mongo DB

In this pattern, mongo db will be deployed in a container and will be used by all the microservices. Perform the following steps to deploy Mongo DB in a container.

```
   $ cd mongodb
   $ kubectl create -f deploy_mongodb.yaml
```

After deployment, the status can be checked as:
```
   $ kubectl get pods
   NAME                    READY   STATUS    RESTARTS   AGE
   mongo-8dc7685d7-nxrcr   1/1     Running   0          73s

   $ kubectl get services |grep mongo
   mongo        NodePort    172.21.84.39   <none>        27017:32643/TCP   11m
```

The hostname and port to connect to mongodb will be `<public_ip_of_cluster>:<mongo_service_port>`. The mongo_service_port in this case, is 32643 (as shown in the above command).

## 7. Deploy Microservices

As explained in step xx, we are creating login, bank account management, credit account and debit account functionality as microservices. Some user credentials and a few bank account details are pre-defined in Mongo DB. 

Perform the following steps to deploy microservices.

**Update MongoDB Connection String**

Prepare connection url as explained in step 6. Then execute the following commands to update mongo db connection URL in app.js of all four microservices. 

```
   cd Microservices
   sed -i '' s#CONNECTION_URL#x.x.x.x:port# login_service/app.js
   sed -i '' s#CONNECTION_URL#x.x.x.x:port# account_management/app.js
   sed -i '' s#CONNECTION_URL#x.x.x.x:port# debit_service/app.js
   sed -i '' s#CONNECTION_URL#x.x.x.x:port# credit_service/app.js   
```

**Prepare deploy target**

All four docker images needs to be pushed to your docker image registry on IBM Cloud. You need to set the correct deploy target. Depending on the region you have created your cluster in, your URL will be in the following format:

```
   <REGION_ABBREVIATION>.icr.io/<YOUR_NAMESPACE>/<YOUR_IMAGE_NAME>:<VERSION>
```

The following command tells you the Registry API endpoint for your cluster. You can get region abbreviation from the output.

```
   ibmcloud cr api
```

To get namespace use the following command:
```
   ibmcloud cr namespaces
```

For example, to deploy the login microservice to my docker image registry in the US-South region, my deploy_target will be:
```
   us.icr.io/test_s1/login_app:v1.0
```

**Deploy login microservice**

Execute the following steps.

```
$ cd login_service
```
Build dockerfile and push the image to registry.

```
$ ibmcloud cr build -t <DEPLOY_TARGET> .
```

Update image location(deploy target) in `deploy.yaml`.

```
$ sed -i '' s#IMAGE#<DEPLOY_TARGET># deploy.yaml
$ kubectl create -f deploy.yaml 

$ kubectl get services|grep login
login-service   NodePort    172.21.113.169   <none>        8080:32423/TCP    31s
```

Need to repeat the same for all other microservices.

**Deploy account_management service**

Following are the steps for account_management service.

```
  cd account_management
  $ ibmcloud cr build -t <DEPLOY_TARGET> .
  
  $ sed -i '' s#IMAGE#<DEPLOY_TARGET># deploy.yaml
  $ kubectl create -f deploy.yaml 

  $ kubectl get services | grep acc
  account-details-service   NodePort    172.21.166.106   <none>        8080:32424/TCP    33s
```

**Deploy Debit service**

Following are the steps for debit account service.

```
  cd debit_service
  $ ibmcloud cr build -t <DEPLOY_TARGET> .
  
  $ sed -i '' s#IMAGE#<DEPLOY_TARGET># deploy.yaml
  $ kubectl create -f deploy.yaml 

  $ kubectl get services |grep debit
  debit-account-service     NodePort    172.21.138.208   <none>        8080:32425/TCP    16s
```

**Deploy Credit service**

Following are the steps for credit account service.

```
  cd credit_service
  $ ibmcloud cr build -t <DEPLOY_TARGET> .
  
  $ sed -i '' s#IMAGE#<DEPLOY_TARGET># deploy.yaml
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

