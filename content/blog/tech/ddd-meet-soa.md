---
title: DDD, meet SOA
slug: ddd-meet-soa
date: 2014-08-13
draft: false
tags:
- architecture
- soa
- ddd
- domaindrivendesign
- serviceoriented
---
There is a lot of discussion online around whether [DDD](https://en.wikipedia.org/wiki/Domain-driven_design) and [SOA](https://en.wikipedia.org/wiki/Service-oriented_architecture) can co-exist, and if so, what that looks like. I am of the opinion that they can co-exist and have arrived at a model that seems to work for me. Consider a complex DDD system with several bounded contexts and contrast it to an SOA system - and I am including the flavor of SOA that I describe in [this post]({{< ref "a-method-for-service-oriented-architecture-soa" >}}).

So, how do the two come together? As I have mentioned before, one problem I have with straight-up SOA is that there is no identifiable "core" of the system where the "meat" is. This "meat" is in fact - the domain logic. Now, add to this the fact that the domain is the only thing that deals directly with the database (technically, it's the infrastructure layer that handles persistence - but you get the idea - it is the domain constructs that are involved in persistence to/from a data store via repositories).

What if we modeled the entire domain as a service? It does not need to be strictly hosted - think of it as a service that is consumed by other services as a library. The repositories combined with the domain objects themselves can replace the accessor/persistor class of services. This makes sense in terms of volatility as well - since the domain really needs to be the part that is least volatile. You can then think of the application layer and the infrastructure layer as being made up of all the other services - and these would still follow the whole utility / computational service / use case handler hierarchy. You would not allow the domain layer to call utility services though - but that is something you would handle through domain events and the like. The presentation layer is still the presentation layer - and is where the UI lives, or the external hosting interface to your services.

The mode of communication between bounded contexts does not change. You can now think of each bounded context as its own SOA subsystem. Communication within bounded contexts would still happen through queues, messages and subscriptions. The application and infrastructure layer would also have "domain event handler" services that handle domain events - I guess you could argue that is just one type of a use case handler. The communication between bounded contexts, as mentioned earlier, stays the same.