---
title: On Service Fabric, Kubernetes and Docker
slug: on-service-fabric-kubernetes-and-docker
date: 2018-10-01
draft: false
tags:
- servicefabric
- azure
- kubernetes
- docker
- microservices
- containers
---
>> **UPDATE (Nov 13, 2019)** My views on this have changed since I wrote this post. See [this post]({{< ref "revisiting-kubernetes-vs-service-fabric" >}}) for where I stand now.

Let us get [Docker](https://en.wikipedia.org/wiki/Docker_(software)) out of the way first. Microservices and containers are quite the hype these days. With hype comes misinformation and hysteria. A lot of people conflate the two (fortunately there are [wise people out there](https://jimmybogard.com/my-microservices-faq/) to set us all straight). If you have done your due diligence and decided to go with microservices, you don't *have* to go with containers. In fact, one would argue that using containers for production might be a good crutch for applications that have too many tentacles and there is no appetite to port them or rewrite them to be "portable". Containers do have [other good use cases](https://jimmybogard.com/containers-what-is-it-good-for/) too. Docker being the leading container format (although starting to face some competition from [rkt](https://coreos.com/rkt/) these days), all in all I am glad containers exist and I am glad that Docker exists. Just be aware of the fact that what you think you must use may not be what you need at all.

[Service Fabric](https://azure.microsoft.com/en-us/services/service-fabric/) was written by Microsoft as a distributed process and state management system to run their own Azure cloud infrastructure. After running Azure on top of it for some years, Microsoft decided to release it as a product with the marketing pitch being geared towards microservices. Whether you are doing microservices or not, if you have any multitude of services or deployment units, Service Fabric is an excellent option. If you are running .NET workloads, then it is an even better option as you get to use its native features such as the Stateful model, among others. Since it is also a process orchestrator, and at the end of the day, a Docker container is just a Docker process, Service Fabric can also act as a decent container orchestrator. Kubernetes I am told has a better ingress configuration system, but Service Fabric has improvements coming related to that. The other big promise is around [Service Fabric Mesh](https://docs.microsoft.com/en-us/azure/service-fabric-mesh/service-fabric-mesh-overview) - which is a fully managed PaaS offering - so that may sway the decision somewhat. 

If you have done your homework and find that containers are the way to go, then [Kubernetes](https://kubernetes.io/) is a good choice for the orchestration system. Even Microsoft is all behind Kubernetes now with their [Azure Kubernetes Service](https://azure.microsoft.com/en-us/services/kubernetes-service/), which only makes sense given that it is in their best interest the more developer ecosystems adopt Azure. It also boasts having run years worth of production workloads at Google. If you are completely onboard with containers, then even if you are running .NET workloads (especially if you are running cross platform workloads such as .NET Core), perhaps you mitigate a lot of risk by sticking to Kubernetes. However, especially if you have a .NET workload, you have to decide whether you want to pick up what you have, put it in containers, and move into Kubernetes; or with some effort you can just make your application portable enough so you don't need containers.

Where do I stand? For my purposes (which involves writing primarily .NET applications), I am partial to Service Fabric. However, take this fact within the context that I have been working with Service Fabric in production for almost a couple of years now, while I have only "played around" with Kubernetes. I do like the fact that Service Fabric can run on a set of homogenous nodes as opposed to Kubernetes that *needs* a master. However, as with stance on things, this one can change given new information and experience.

What should you do? Not listen to quick and easy decision making flowcharts. When you do listen to opinions, be aware of the fact that they are influenced by experience and also sometimes by prejudice. Finally, evaluate your own needs carefully rather than do something because "everybody is doing it". I could be eating my words years from now, but based on their origins and use, I don't think either Service Fabric or Kubernetes are at risk of being "abandoned" by their stewards (i.e. Microsoft and Google) at any point.
