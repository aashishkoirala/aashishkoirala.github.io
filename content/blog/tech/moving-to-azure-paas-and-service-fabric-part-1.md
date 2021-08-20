---
title: Moving to Azure PaaS and Service Fabric- Part 1
slug: moving-to-azure-paas-and-service-fabric-part-1
date: 2017-01-15
draft: false
tags:
- azure
- paas
- servicefabric
---
This is Part 1 of a two-part blog series:

- Part 1 (this one; Application- Services, Security and UI)
- [Part 2]({{< ref "moving-to-azure-paas-and-service-fabric-part-2" >}}) (Database, Configuration, Logging, Caching, Service Bus, Emails, Tooling, Rollout)

---

It has been an action-packed year at work. We moved our entire platform in one fell swoop from on-premises to [Azure PaaS (Platform as a Service)](https://azure.microsoft.com/en-us/overview/what-is-paas/). Since this was a big re-platforming effort that would incur regression testing across the entire set of applications, we took this opportunity to include a few technology upgrades in the process. All in all, it was a daunting task and took quite a bit of research and preparation before the actual implementation could be done. I think it is worth it to highlight some of the key achievements. The move entailed the following key aspects:

- **Application- Services, Security and UI:** The move from WCF on IIS to Web API over [OWIN](http://owin.org/) on [Azure Service Fabric](https://azure.microsoft.com/en-us/services/service-fabric/), the move from WS-Fed over WIF to [OAuth2](https://oauth.net/2/)/[OpenID Connect](https://openid.net/connect/), and the move from server side MVC with jQuery based AJAX to full-on SPA with AngularJS
- **Database:** The move from SQL Server on-premises to a combination of [SQL Azure PaaS](https://azure.microsoft.com/en-us/services/sql-database/) and [Azure BLOB Storage](https://azure.microsoft.com/en-us/services/storage/blobs/)
- **Configuration:** The move from file system to [Azure BLOB Storage](https://azure.microsoft.com/en-us/services/storage/blobs/) 
- **Logging:** The move from file system to [Azure Table Storage](https://azure.microsoft.com/en-us/services/storage/tables/)
- **Caching:** The move from [AppFabric](https://en.wikipedia.org/wiki/AppFabric_Caching) to [Redis](https://redis.io/)
- **Service Bus:** The move from on-premises Windows Service Bus to [Azure Service Bus](https://azure.microsoft.com/en-us/services/service-bus/)
- **Emails:** The move from on-premises SMTP server to [SendGrid](https://sendgrid.com/).
- **Tooling:** Building provisioning, deployment and other tools for the new platform
- **Rollout:** The actual deployment to and switch to the new platform

I will attempt to do a quick overview of each of these aspects.

**Application: Services, Security and UI**

We have a microservices-like architecture- not all the way microservices though. We practice SOA and thus our system is decomposed into services that have dependencies on each other and GUIs that have dependencies on the services. This is decoupled from our hosting and deployment model. We group several services into hosts based on a number of factors. A host then is our unit of deployment and represents a runtime process. Additionally, the services don't carry their configuration with them - the configuration is a single deployment artifact that is then centrally accessed by all services.

The existing on-premises hosting mechanism was using IIS to expose each host as an application that then exposed the underlying services over WCF. With the announcement of [Service Fabric](https://azure.microsoft.com/en-us/services/service-fabric/), we decided that was going to be our new hosting environment with our move to Azure. Having been dealing with deployment and management of a significant number of services and having seen the challenge of doing that on IIS without the help of any service orchestration system, we knew we needed *something*. Service Fabric proved to be the ideal solution:

1. While it has container orchestration facilities like those provided by [Kubernetes](https://kubernetes.io/) (maybe not all the way for containers like Kubernetes), that was not our use case. We had pure .NET workloads that had first-class support for application level orchestration through Service Fabric. This was the perfect scenario.
2. Proven robustness - in that Service Fabric is what a lot of Azure services themselves run on top of.
3. The opportunity to one day take advantage of the Stateful service model that is a capability you can take advantage of if you are running native .NET workloads on the fabric (as opposed to guest executables or containers).  
 
We are enamored with it enough at this point that we would have adopted it even if we stayed on-premises. In fact, we still have an on-premises development environment (how that is maintained with abstraction layers so it can run both on-premises and with Azure PaaS is a whole another blog post that I won't get into here) that runs on an on-premises installation of Service Fabric. With Service Fabric alleviating some of the complexity woes associated with making more granular microservice-style deployment, we considered moving to that scenario. However, looking at the memory footprint of each hosted service gave us pause for thought. We decided to stick with our existing model of grouping services into hosts that then would be the unit of deployment.

If I had to boil the steps involved down to a few bullet points:

1. We created the concept of host model descriptors. Concretely, these are JSON files that describe how a host is constructed, what services are involved, how they call each other, and so on.
2. We created a host generation mechanism that was part of the deployment tooling. This was able to read a host model descriptor along with pre-defined templates and on-the-fly generate Service Fabric service and application projects which could then be packaged up and published to Service Fabric.
3. We created a script to read all our existing WCF host projects and convert them to host model descriptors.
4. We needed an API gateway to expose the services running on the fabric. On top of this, we now had the added layer of mapping services to whatever hosts they were running on. This way, consumers of those services would not need to concern themselves with the host allocation and could simply address a service. In order to handle these needs and a bunch of others, we built a Router application that then became the public facing endpoint to all the services.  

With all this in place, we could now take our existing services and without touching a line of business operation code, we could re-target them to run on Service Fabric. Pretty neat. In terms of security, while WS-Fed using WIF was serving us well, we had recognized that it was perhaps a bit too bloated and while it played well with WCF, our implementation of it, which included a homegrown STS based on it, required quite a bit of upkeep. Additionally, at the time there was not enough extension points on the WCF based listeners on Service Fabric.

All this and a creeping notion that WCF was on its way to becoming a dying technology soon) acted as catalysts for us to make the decision to ditch WCF, WIF and WS-Fed altogether in favor of a lightweight JSON-over-HTTPS based model running on OWIN/Katana with OAuth2 (specifically OpenID Connect) acting as the security protocol of choice. While this involved changes to application hosting, the big chunk of the effort was in rewriting the STS as an OWIN/Katana-based Angular app that used [IdentityServer](https://identityserver.io/) to handle OpenID Connect. While OpenID Connect would be the primary protocol, we still had parties that needed to get in via SAML - so we had to build adapters for that as well.

In terms of the UI, our frontend applications were ASP.NET MVC based with a hodgepodge of jQuery, Knockout here and there, etc. and were lacking in any common unifying pattern. The WIF integration also was a little too tight of a coupling for my liking. Since redoing our frontends on a core SPA driven pattern was always in our wish-list, this was the perfect time to do so since we would have to deal with removing WIF and integrating with our new OAuth2 based STS, and with hosting the frontends on the Service Fabric as well. We opted to go with AngularJS (1.x) as it was the best choice for us *at the time* (since then, for our newer efforts, we have evaluated the new Angular and React as well with the decision to be made soon). The makers of IdentityServer also provide a OIDC token manager that is built specifically for SPA applications to work with STS applications based on IdentityServer. We just had to build a few core modules and codify our patterns. 

That's quite enough for now. More to come in [Part 2]({{< ref "moving-to-azure-paas-and-service-fabric-part-2" >}}).
