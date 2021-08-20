---
title: Moving to Azure PaaS and Service Fabric- Part 2
slug: moving-to-azure-paas-and-service-fabric-part-2
aliases:
- /blog/moving-to-azure-paas-and-service-fabric-part-2
date: 2017-01-30
draft: false
tags:
- azure
- paas
- servicefabric
---
This is Part 2 of a two-part blog series:

- [Part 1]({{< ref "moving-to-azure-paas-and-service-fabric-part-1" >}}) (Application- Services, Security and UI)
- Part 2 (this one; Database, Configuration, Logging, Caching, Service Bus, Emails, Tooling, Rollout)

---

**Database**

We moved from our on-premises installation of SQL Server to the PaaS offering that is SQL on Azure. Other than the actual physical moving of the data, the additional challenge we had was that our system had a number of separate databases that were interconnected via synonyms. Since each SQL Database is an independent resource on Azure, this would not be possible without introducing external data sources which would still be performance prohibitive. We therefore had to remove the synonyms and rework some of our code to account for this. We opted to go with an Elastic Pool that was associated with all our databases. We also configured geo-replication for redundancy.

Additionally, part of our system includes a document storage mechanism that ends up storing the document BLOBs in SQL. We decided to take this opportunity to also move these BLOBs out of SQL and in to Azure BLOB Storage where they naturally belong. We wrote a tool to extract all BLOBs out of SQL and upload them into Azure BLOB Storage. We ran it a week before the actual rollout, with the plan being to upload the last week's worth as part of the rollout. In order to move the SQL data, we provisioned empty databases on Azure and set up replication from the on-premises databases. This way, come rollout time, the on-premises databases and the ones on Azure would already be in sync, thus eliminating the riskiest step of massive data movement.  

**Configuration**

We have a bespoke configuration system based around XML files. The major change here would be going from the files residing on some local share to them residing in BLOB storage. Code change needed for that was done, as well as the change to the settings deployment mechanism - which now went from simply copying files to the share to uploading the files to Azure BLOB storage.
 
**Logging**

We had two forms of logging: application level logging that uses *log4net* to write out to configured appenders. Since we went from file system to Azure Table Storage, this involved writing a new appender that would send the log entry off to Table Storage. The other piece was ETW-based tracing. We configured a VM extension as part of the Service Fabric cluster that would gather all ETW traces and upload them to Table Storage. The last part was redoing the log viewer tooling to read from Table Storage. 

**Caching**

This was a significant change in going from AppFabric, which was being sunset, to Redis - which was the recommended distributed cache for Azure. We discovered a few leaks in our existing abstraction layer where some consuming code was dependent on AppFabric-specific features such as versioning. This needed some reworking of the code. Other than this, we quite extensively use the locking feature for distributed pessimistic locking. With Redis, no such feature natively exists. However, there is a published algorithm that states how it can be done. While our main Redis client library, StackExchange.Redis, did not have this implemented, we ended up using RedLock.net for this purpose. 

**Service Bus**

I think this was the least work required, because we were already using Windows Service Bus - the almost out-of-support on-premises version of Azure Service Bus. So moving to Azure Service Bus was akin to a version upgrade without much rework needed on the code.  

**Emails**

For all automated emails that the applications send out, we moved from an on-premises SMTP server to SendGrid. The initial setup was straightforward. Other considerations we had to work around was setting up **SPF** and **DKIP** with our DNS provider so that SendGrid could be designated as an authorized sender of emails from our domain. SendGrid has facilities to do all these so that step was easy. Additionally, we had to make sure **DMARC** setup was properly done on our side.

**Tooling**

Much of this has already been covered in other sections, but essentially boiling it down to a few bullet points, we had to work on the following aspects of tooling:

- Deployment - we are now deploying to Service Fabric and not to IIS anymore, plus as part of deployment, we are also generating Fabric projects on the fly based on host model descriptors.
- Logging - the tool we use to aggregate and view logs now talks to Table Storage.
- Databases - tooling related to database backup/restore, export/import, etc. all have to work against Azure. Additionally, database maintenance scripts are now hosted using Azure Automation instead of SQL Server Agent.
- Provisioning - we needed to write a brand new provisioning system using Azure Resource Manager APIs that would allow us to stand up and tear down platforms as needed on Azure.

**Rollout**

We stood up the entire environment a week prior to actual rollout, which gave us plenty of time to test and correct. Owing to the database migration strategy that involved replication, a lot of risk was mitigated. Thus, the actual rollout involved simply:

- Start outage window.
- Repoint DNS to new application.
- Ensure replication has no transactions pending, and turn off replication.
- Upload BLOBs that were created during the last week.
- End outage window.

And with that, we were on Azure. Not a traditional lift-and-shift by any means. We were fully cloud-native on PaaS - wholesale- the entire system. Quite a feat if you ask me.
