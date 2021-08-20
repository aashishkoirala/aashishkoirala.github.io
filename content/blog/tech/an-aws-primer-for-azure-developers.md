---
title: An AWS Primer for Azure Developers
slug: an-aws-primer-for-azure-developers
aliases:
- /blog/an-aws-primer-for-azure-developers
date: 2020-04-15
draft: false
tags:
- azure
- amazon
- aws
- cloud
---
Even though [AWS](https://aws.amazon.com/) has been around for much longer, as is the norm for a lot of people coming from the .NET/Microsoft side of things, my cloud experience started with [Azure](https://azure.microsoft.com/). I got into AWS when I was a few years into Azure. I remember thinking at that point it would be nice to have something like this primer that would give me a very high-level introduction to AWS based on what I knew of Azure. So here it is.

Obviously everything can't be covered- I've kept this very high level so you have a starting point based on your needs, plus the services covered are geared more towards general-purpose application development as opposed to specialized cases like machine learning, IoT, big data or data warehousing.

Here is what I cover:
* Accounts, Subscriptions & Resources
* Administration
* Security
* Provisioning and Infrastructure as Code (IaC)
* Infrastructure as a Service (IaaS) and Networking
* Platform as a Service (PaaS)- includes Applications and Serverless, Containers and Kubernetes, Database, Cache, Messaging, Storage, Observability, and SCM/CI/CD.
 
**Accounts, Subscriptions & Resources**

The major difference here is the concept of _Subscriptions_ in Azure which does not exist in AWS. When you create an account in AWS, that is already at the level of what you would call a subscription in AWS. So, if you are an organization that has multiple subscriptions in Azure, the corresponding experience in AWS would be to just have multiple accounts. To ease the management overhead this would cause, AWS has an offering called [Organizations](https://aws.amazon.com/organizations/).

The other difference is the concept of [Resource Groups](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/overview) in Azure which, again, does not exist in AWS (or rather [exists but in a very different way](https://docs.aws.amazon.com/ARG/latest/userguide/welcome.html)). Whereas resource groups are a first-class deployment-level construct in Azure, AWS resource groups are just a tagging mechanism. _Locations_ in Azure correspond to _Regions_ in AWS as you would expect - but the role that resource groups play in resource structuring in Azure are for the most part played by AWS regions.

Resources in Azure get a [Resource Identifier](https://docs.microsoft.com/en-us/rest/api/resources/resources/getbyid); the equivalent concept in AWS is the [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html).

**Administration**

While there are multiple modes of administration for both, the common modes are that both have a CLI and a web-based GUI. The CLIs operate similarly - you login and get a context and then all your operations are against that context. The account/subscription/resource group/region difference mentioned above plays into this as well. Practically, though, [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest) and [AWS CLI](https://aws.amazon.com/cli/) are pretty similar in how they work.

The major difference can be seen in the web GUI experience. With [Azure Portal](https://azure.microsoft.com/en-us/features/azure-portal/), you pick an account and then within that account, you get the blade-based UI that shows you all resources/resource groups in one place, and as you get deeper into various settings, the blades pile on - but for the most part it's one unified UI. As of this writing, it has Dark Mode support whereas AWS Console does not.

[AWS Console](https://aws.amazon.com/console/) is much more segmented - you first sign in to an account, then you pick a region, then you pick a service and a standalone Console opens up specific to only that service with a UI that is tailored for that service. Since when you initially get started with either Azure or AWS, the web GUI will be your most likely landing spot, this causes some disorientation. This has been a long-standing complaint against AWS Console - the lack of a way to look at all your resources in one place regardless of service type or account. On the other hand, once you start getting deep into a specific service's configuration, some think the Azure blade UI has a tendency to get "out of hand" - so pros and cons on both sides.

**Security**

The repository that drives security and access control in Azure is [Azure Active Directory (AAD)](https://azure.microsoft.com/en-us/services/active-directory/). All role-based access control (RBAC) is driven off AAD. This aspect on AWS is served by [Identity and Access Management (IAM)](https://aws.amazon.com/iam/). Both have similar security constructs in the way of users, groups, roles, policies and permissions. There are significant differences in implementation and how it applies to resource access for administration as well as for consumption - so this is a fundamental aspect of both that is worth getting to know in depth before jumping in.

**Provisioning and Infrastructure as Code (IaC)**

Of course, we would all rather be using [Terraform](https://hashicorp.com/products/terraform) or [Pulumi](https://www.pulumi.com/) - but that may not always suit your needs in which case you do have to deal with the native IaC system provided by each. The counterpart to _Azure Resource Manager_ in AWS is [CloudFormation](https://aws.amazon.com/cloudformation/). Like you author [ARM Templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/overview) in Azure, you author [CloudFormation Stacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacks.html) in AWS. CloudFormation supports both JSON and YAML whereas ARM only supports JSON.

**Infrastructure as a Service (IaaS) and Networking**

[Azure VMs](https://azure.microsoft.com/en-us/services/virtual-machines/) and [VM Scale Sets](https://azure.microsoft.com/en-us/services/virtual-machine-scale-sets/) allow you to provision and scale VMs on the cloud. AWS does this via [Elastic Compute Cloud (EC2)](https://aws.amazon.com/ec2/). You can define virtual networks and subnets where your VMs run (as well as some PaaS services) in Azure with [Azure VNET](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview), and in AWS with [Virtual Private Cloud (VPC)](https://aws.amazon.com/vpc/). Both Azure and AWS provide DNS and DNS based traffic routing services (Azure with [Azure DNS](https://azure.microsoft.com/en-us/services/dns/) and [Traffic Manager](https://docs.microsoft.com/en-us/azure/traffic-manager/traffic-manager-overview), and AWS with [Route 53](https://aws.amazon.com/route53/)). Load balancing is available on Azure with [Load Balancer](https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-overview) and on AWS with [Elastic Load Balancing](https://docs.aws.amazon.com/elasticloadbalancing/). The corresponding service on AWS for Azure's [Front Door](https://docs.microsoft.com/en-us/azure/frontdoor/front-door-overview) is [Global Accelerator](https://aws.amazon.com/global-accelerator/). Both Azure and AWS have CDN services- with [Azure CDN](https://azure.microsoft.com/en-us/services/cdn/) and AWS [CloudFront](https://aws.amazon.com/cloudfront/).

**Platform as a Service (PaaS)**

If you stick to IaaS, once you have set up your VM and networking, a VM is a VM is a VM. Not much else to it - it gets more interesting when you get into PaaS with all the different services and offerings and, of course, fancy names (more of those on the AWS side). Again, keeping with the "just general-purpose application development" theme, I've covered the following "service categories" if you will:
* Applications and Serverless
* Containers and Kubernetes
* Database
* Cache
* Messaging and Event Processing
* Storage and Secrets
* Observability
* SCM and CI/CD


**Applications and Serverless**

If you want to get an application (or a bunch of them) up and running without worrying about infrastructure, you would use [App Service](https://azure.microsoft.com/en-us/services/app-service/) on Azure. This purpose is served by [Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/) in AWS. Both support all the major mainstream languages. To define and orchestrate workflows, whereas you would use [Logic Apps](https://azure.microsoft.com/en-us/services/logic-apps/) on Azure, you could use either [Simple Workflow Service](https://aws.amazon.com/swf/) on AWS. Fully serverless, spin-up-on-demand-via-triggers compute is available on Azure as [Functions](https://azure.microsoft.com/en-us/services/functions/) and on AWS as [Lambda](https://aws.amazon.com/lambda/). You can string up a bunch of Lambdas to implement workflows on AWS using [Step Functions](https://aws.amazon.com/step-functions/).

**Containers and Kubernetes**

Serverless container management is available in Azure with [Container Instances](https://azure.microsoft.com/en-us/services/container-instances/). Between [Elastic Container Service (ECS)](https://aws.amazon.com/ecs/) and [Fargate](https://aws.amazon.com/fargate/), AWS has this covered. Both have their versions of a container registry- Azure with [Azure Container Registry (ACR)](https://azure.microsoft.com/en-us/services/container-registry/) and AWS with [Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/). If you want to be on Kubernetes, Azure has a managed offering with [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-us/services/kubernetes-service/). The corresponding AWS service is [Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/).

**Database**

Azure supports [SQL Server](https://azure.microsoft.com/en-us/services/sql-database/), [MySQL](https://docs.microsoft.com/en-us/azure/mysql/overview) and [PostgreSQL](https://azure.microsoft.com/en-us/services/postgresql/) all as PaaS services. The corresponding service offering on AWS is [Relational Database Service (RDS)](https://aws.amazon.com/rds/). As far as purpose-built/NoSQL databases are concerned, AWS seems to have more offerings, but a lot of that is also owing to a lot of these in Azure being bundled within [Cosmos DB](https://azure.microsoft.com/en-us/services/cosmos-db/). The closest thing to native Cosmos DB as well as [Table Storage](https://azure.microsoft.com/en-us/services/storage/tables/) on Azure is [DynamoDB](https://aws.amazon.com/dynamodb/) in AWS.

Another common pattern with databases on both Azure and AWS is proprietary database engines that then have compatibility with some standard API. For example, you can set up Cosmos DB with MongoDB compliance (the AWS counterpart being [DocumentDB](https://aws.amazon.com/documentdb/)) or with Cassandra compliance (the AWS counterpart being [Keyspaces](https://aws.amazon.com/keyspaces/)). In the same vein, switching back to relational, AWS has [Aurora](https://aws.amazon.com/rds/aurora/) - which is a proprietary database engine atop RDS that has compatibility either with MySQL or PostgreSQL.

**Cache**

Azure has a managed [Redis Cache](https://azure.microsoft.com/en-us/services/cache/) offering. The corresponding service in AWS is [ElastiCache](https://aws.amazon.com/elasticache/) which supports both Redis as well as Memcached.

**Messaging and Event Processing**

As far as message queues are concerned, Azure Storage has a [Queue Storage](https://azure.microsoft.com/en-us/services/storage/queues/) option. For more advanced usage, [Azure Service Bus](https://azure.microsoft.com/en-us/services/service-bus/) has _Queues_ as well. The closest equivalent on AWS to these is [Simple Queue Service (SQS)](https://aws.amazon.com/sqs/). The closest equivalent to _Topics_ on Azure Service Bus on AWS is [Simple Notification Service (SNS)](https://aws.amazon.com/sns/). On more of the event processing side, Azure Service Bus has [Event Hub](https://azure.microsoft.com/en-us/services/event-hubs/) and there's also Azure [Event Grid](https://azure.microsoft.com/en-us/services/event-grid/) - the AWS counterpart to these is the [Kinesis](https://aws.amazon.com/kinesis/) set of services. You can't talk events without talking about Kafka- whereas Azure has Kafka support as part of [HDInsight](https://azure.microsoft.com/en-us/services/hdinsight/), AWS has [Managed Streams for Kafka (MSK)](https://aws.amazon.com/msk/).

Since we brought up HDInsight, even though not technically messaging or event processing, HDInsight supports both Hadoop and Spark. The AWS equivalents for these would be [EMR](https://aws.amazon.com/emr/) and [Glue](https://aws.amazon.com/glue/), respectively. Finally, only slightly related to all these- Azure does not have a dedicated email service- it promotes _SendGrid_ as a marketplace option. AWS does have [Simple Email Service (SES)](https://aws.amazon.com/ses/) - so there's that.

**Storage and Secrets**

Setting aside Queue Storage (which is a queue more than storage) and Table Storage (which is a database more than storage) which I mentioned above, [Azure Storage](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview) groups two pure storage services- [BLOB Storage](https://azure.microsoft.com/en-us/services/storage/blobs/) (the AWS counterpart being [Simple Storage Service or S3](https://aws.amazon.com/s3/)) and [File Storage](https://azure.microsoft.com/en-us/services/storage/files/) (the AWS counterpart being [Elastic File System or EFS](https://aws.amazon.com/efs/)). In terms of block level storage, Azure has [Managed Disks](https://azure.microsoft.com/en-us/services/storage/disks/) whereas AWS has [Elastic Block Store (EBS)](https://aws.amazon.com/ebs/).

For secret management, [Key Vault](https://azure.microsoft.com/en-us/services/key-vault/) is the Azure one-stop-shop. AWS has a bunch of services that deal with secrets and keys- such as [KMS](https://aws.amazon.com/kms/), [CloudHSM](https://aws.amazon.com/cloudhsm/) and [Secrets Manager](https://aws.amazon.com/secrets-manager/). There's also [Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) which is a general-purpose configuration data storage service but also supports encrypted secrets.

**Observability**

Between [Azure Monitor](https://azure.microsoft.com/en-us/services/monitor/) and [Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview), your logging, tracing and monitoring needs should be covered on Azure. The corresponding services in AWS are [CloudWatch](https://aws.amazon.com/cloudwatch/) and [X-Ray](https://aws.amazon.com/xray/).

**SCM and CI/CD**

[Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/) is a set of tools to support SCM and CI/CD (including Azure Repos for source control and Azure Pipelines for CI/CD). AWS has its own source control service in [CodeCommit](https://aws.amazon.com/codecommit/) along with CI/CD provided by [CodeBuild](https://aws.amazon.com/codebuild/) and [CodePipeline](https://aws.amazon.com/codepipeline/).

In conclusion, I hope this helps someone. It is very high level and barely scratches the surface of anything, really. I felt the need for something like this especially when I was building software that needed to run natively on both cloud platforms or when I was building abstractions for cross cutting functionality. In any case, I hope it orients you in the right direction if you are at a similar position.