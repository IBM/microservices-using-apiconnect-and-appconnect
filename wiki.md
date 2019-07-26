# Short Title

Build a secure microservices based application using API Connect and App Connect


# Long Title

Build a secure funds transfer solution for personal banking scenario using IBM API Connect for authorizaton, and App Connect Enterprise for orchestration of microservices to complete the operation


# Author

* [Shikha Maheshwari](https://www.linkedin.com/in/shikha-maheshwari) 
* [Balaji Kadambi](https://www.linkedin.com/in/balaji-kadambi-1519223/)
* [Muralidhar Chavan](https://www.linkedin.com/in/muralidhar-chavan-3335b638/)
* [Manjula Hosurmath] (https://in.linkedin.com/in/manjula-g-hosurmath-0b47031)


# URLs

### Github repo

> "Get the code": 
* https://github.com/IBM/microservices-using-apiconnect-and-appconnect


### Other URLs

* Demo URL

https://github.com/IBM/microservices-using-apiconnect-and-appconnect/blob/master/images/demo.gif


# Summary

In this code pattern, we demonstrate a funds transfer solution in a personal banking scenario using IBM API Connect and IBM App Connect. API Connect is used to provide OAuth based authorization security to microservices and App Connect Enterprise for easier and seamless integration of APIs (with zero code) for a business user. The solution comprises authentication, authorization and funds transfer functionality.


# Technologies

* [Microservices](https://www.ibm.com/cloud/garage/architectures/implementation/microservices-kubernetes): Learn how to build cloud-native microservices application on Kubernetes-based IBM Cloud container services.

* [Application Integration](https://developer.ibm.com/integration/): Drive your digital transformation and business results by developing hybrid integration solutions for your cloud and on premises apps

* [API Management](https://developer.ibm.com/apiconnect/2019/01/10/what-is-api-management/): API Management is about driving the consumption of business assets securely and easily.


# Description

In a microservices based solution, the common requirements include security of microservices, orchestration (integration with many other applications) of APIs. Such requirements are very important especially in the banking and financial services domain.

In this code pattern, we demonstrate a banking solution using IBM API Connect and IBM App Connect. API Connect is used to provide OAuth based authorization security to microservices and App Connect Enterprise for easier and seamless integration of APIs (with zero code) for a business user. The solution comprises authentication, authorization and funds transfer functionality.


# Flow

![Architecture](https://github.com/IBM/microservices-using-apiconnect-and-appconnect/blob/master/images/architecture.png)


# Instructions

> Find the detailed steps for this pattern in the [readme file](https://github.com/IBM/microservices-using-apiconnect-and-appconnect/blob/master/README.md) 

The steps will show you how to:

1. Authentication and authorization using OAuth in API Connect.
2. Funds transfer operation with orchestration of APIs exposed by Account Management Service, Credit Account Service and Debit Account Service using App Connect.
3. To build and deploy Node.js microservices on IBM Kubernetes Service.
4. Development of a client application using Node-RED.


# Components and services

* [IBM Cloud Kubernetes Service](https://cloud.ibm.com/containers-kubernetes/catalog/cluster): IBM Kubernetes Service enables the orchestration of intelligent scheduling, self-healing, and horizontal scaling.

* [IBM App Connect on Cloud](https://cloud.ibm.com/catalog/services/app-connect): Use App Connect to connect your different applications and make your business more efficient. Set up flows that define how data is moved from one application to one or more other applications.

* [IBM API Connect](https://cloud.ibm.com/catalog/services/api-connect): IBM API Connect is a comprehensive end-to-end API lifecycle solution that enables the automated creation of APIs, simple discovery of systems of records, self-service access for internal and third party developers and built-in security and governance.

* [Node-RED](https://cloud.ibm.com/docs/starters/Node-RED?topic=starters-gettingstarted#nodered): Node-RED provides a browser-based flow editor that makes it easy to connect devices, APIs, and online services by using the wide range of nodes in the palette.


# Runtimes

* [SDK for Node.js](https://console.bluemix.net/catalog/starters/sdk-for-nodejs):Develop, deploy, and scale server-side JavaScript® apps with ease. The IBM SDK for Node.js™ provides enhanced performance, security, and serviceability.


# Related IBM Developer content

* [Create a microservices-based digital banking web-application](https://developer.ibm.com/patterns/build-digital-bank-microservices-kubernetes/)
* [Securing modern API- and microservices-based apps by design, Part 1](https://developer.ibm.com/articles/securing-modern-api-and-microservices-apps-1/)
* [Get started with agile integration architecture](https://developer.ibm.com/tutorials/get-started-with-agile-integration-architecture-integration-modernization-in-action/)


# Related links

* [Securing an API by using OAuth 2.0](https://www.ibm.com/support/knowledgecenter/en/SSFS6T/com.ibm.apic.toolkit.doc/tutorial_apionprem_security_OAuth.html)
* Introduction to App Connect on Cloud https://developer.ibm.com/integration/docs/app-connect/
* OpenAPI APIs https://developer.ibm.com/integration/docs/app-connect/how-to-guides-for-apps/use-ibm-app-connect-openapi/
* Creating flows for APIs https://developer.ibm.com/integration/docs/app-connect/tutorials-for-ibm-app-connect/creating-flows-api/
* Calling API in a flow https://developer.ibm.com/integration/docs/app-connect/creating-using-apis/calling-apis-flow/
* Toolbox flow https://developer.ibm.com/integration/docs/app-connect/toolbox-utilities/adding-conditional-logic-flow/


# Announcement

## Build a secure microservices based application using API Connect and App Connect
In today’s IT world, microservices architecture has become a necessity, owing to the benefits that it provides, such as ideal fit for agile methodology, native to cloud-based development, organized around business capabilities, improved productivity and speed, and flexibility in using technologies and scalability. However, the business organizations will face the following challenges with microservices:

- Complexity in the integration of the distributed services
- Difficulties in managing Authentication and Authorization across distributed microservices
- Information barriers that lack an end-to-end governance of the business flow across the services

IBM Code Pattern [Build a secure microservices based application using API Connect and App Connect](https://github.com/IBM/microservices-using-apiconnect-and-appconnect) demonstrates a case which addresses the above challenges. In this Code Pattern we have taken a simple banking scenario for a `Fund Transfer`. There are microservices such as `Login`, `Account Check`, `Debit Transaction` and `Credit Transaction`. API Connect is used to provide OAuth based authorization security to microservices. App Connect Enterprise is used for easier and seamless integration of APIs (with zero code) for a business user.



