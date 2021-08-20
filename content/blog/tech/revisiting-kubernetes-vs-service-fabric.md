---
title: Revisiting Kubernetes vs. Service Fabric
slug: revisiting-kubernetes-vs-service-fabric
aliases:
- /blog/revisiting-kubernetes-vs-service-fabric
date: 2019-11-13
draft: false
tags:
- kubernetes
- servicefabric
- containers
- microservices
---
Since I wrote [my initial post]({{< ref "on-service-fabric-kubernetes-and-docker" >}}) regarding [Kubernetes](https://kubernetes.io/) and [Service Fabric](https://azure.microsoft.com/en-us/services/service-fabric/), a few things have happened:
- Kubernetes had a chance to mature a lot more and also, needless to say, has sky-rocketed in adoption.
- Managed Kubernetes on the major cloud providers (AKS/EKS/GKE) has had a chance to mature a lot more.
- Adoption of Service Fabric is miniscule in comparison.
- Microsoft itself seems to be putting (wisely so) much of its firepower behind Kubernetes while Service Fabric sort-of just sits there on the side.
- The successor to Service Fabric (i.e. [Service Fabric Mesh](https://docs.microsoft.com/en-us/azure/service-fabric-mesh/service-fabric-mesh-overview)) - is going to be container-driven.

Specifically, in terms of where Microsoft is putting its money, I think that got brought home at [Ignite 2019](https://news.microsoft.com/ignite2019/). You only need to sit through the major keynotes and peruse the sessions to figure out that as far as these kinds of platforms are concerned, Kubernetes has "won the day". All things being equal, my suggestion would be to adopt Kubernetes and avoid Service Fabric. If you are starting out, this means making sure you pick a technology that is not bound to any specific OS platform (sure, Kubernetes [can run Windows]({{< ref "working-with-windows-containers-in-kubernetes" >}}) workloads, but it will be a while before it gets parity with Linux if it ever does). If you're already invested in Service Fabric, put a migration plan in place to move away.

Not to say that Service Fabric is going to be sunsetted any time soon. After all, a lot of Azure services supposedly run on it. That does not preclude Microsoft from winding it down slowly as a public offering though. I would say Service Fabric is in a similar bucket as a lot of other similar platforms- Mesos, Nomad, Borg, or whatever Netflix's proprietary thing is called. They are all solid platforms and battle tested and are in wide use by companies that built them or adopted them pre-Kubernetes. As a general consumer of tech, though, Kubernetes seems to be the better choice.

This, of course, does not mean you should couple your software to Kubernetes or any specific platform for that matter. If you build it such that you can easily port from one to another, these fluctuations in the technology landscape are a lot less painful.