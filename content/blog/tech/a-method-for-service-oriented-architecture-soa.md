---
title: A Method for Service-Oriented Architecture (SOA)
slug: a-method-for-service-oriented-architecture-soa
aliases:
- /blog/a-method-for-service-oriented-architecture-soa
date: 2014-07-17
draft: false
tags:
- architecture
- soa
- serviceoriented
---
When you adopt service oriented architecture ([SOA](https://en.wikipedia.org/wiki/Service-oriented_architecture)), the most important aspect of your architecture and high-level design step when building a new system is obviously decomposition of the system into the right services. A prudent way to decompose a system into services is to first identity what parts of the system is more likely to change more frequently. Thus, you decompose by volatility and set up dependencies such that you always have more volatile services calling less volatile services. Within the same level of volatility, of course, you would further decompose services by function if needed.

This, it is said, makes for a much more maintainable system that is much more adaptable to business requirement changes - which are obviously the norm in our industry. There is a school of thought, however, that goes one level beyond this. It classifies a service as one of the following four types (in increasing order of volatility): utilities, accessors/persistors, computational services and use case handlers.

A **utility** service is something that deals solely with cross cutting concerns - throughout the system (such as security, logging, configuration), or throughout a given domain (e.g. persisting of documents in a larger system of which documents are a part). Utilities are mostly purely technical and can be called by all services.

An **accessor/persistor** is the service that sits closest to the data at hand - be it some external resource, or as is more likely to be the case, the database. These services deal primarily with retrieval and storage, but also logical grouping of the data in a manner that makes sense to the rest of the application (think aggregates in [DDD]({{< ref "getting-on-the-domain-driven-design-bandwagon" >}}) terms), data-level validation, redaction for security, etc. Since these services are closest to the metal (that being the database), and we don't want volatility to sneak in there, these need to be the least volatile services apart from utilities. These are the only services that can talk to data sources, and can be called by use case handlers and computational services. Utilities cannot call them. Other accessors/persistors cannot call them either.

A **computational** service will have hardcore computational logic that can change more often than, say, your database schema, but less often than specific use cases. They can call utilities and accessors/persistors; but usually it is advised that they be purely computational - in that they get the data they need to work with handed to them, they do their thing, and then they return their output. Only use case handlers can call them.

A **use case handler** is most volatile and executes business use cases by mostly orchestrating calls to less volatile services. They can call utilities, computational services and accessors/persistors as needed. They also handle operation level authentication and authorization if applicable. They are the external interface to the "service platform" in that all consumers, be it the UI or external systems - can only talk to use case handlers. Less volatile services are thus shielded. What if a use case handler needs to call another use case handler? Within a contiguous subsystem, that should not happen. If it happens, that is a design smell. That could become necessary to facilitate communication between two subsystems - in which case, it is a better idea to do it through queues, messages and subscriptions (think bounded contexts in DDD terms).

There are a few more guidelines to top these off:

*   Name your services so their role in the above taxonomy becomes clear. Instead of just "FooService", think "FooUtility", or "FooRepository" for accessors/persistors, "FooCalculator" or "FooEngine" for computational services, and "FooHandler" or "FooManager" for use case handlers.
*   As you are performing detailed design, keep an eye on the number of operations in a service. If it is starting to feel like a lot, perhaps it is time to decompose a bit further.
*   Treat each service as "the" unit of development for your system. This means - each service is a self-contained unit complete with tests and such. This also means that while you want to stay DRY within a service within reasonable limits, it may not be the best idea to strive for perfect DRYness across services.
*   Each operation should validate its requests and handle authentication and authorization if needed in a self-contained manner.

All of this also aligns pretty well with SOLID design principles. Now, all of this sounds great on paper; however, there are a few pain points to consider. If you strictly adhere to these restrictions, you will end up creating a lot more services than if you didn't. For example, there are a lot of cases where the use case simply is to go get the data and go store the data. In such situations, you are forced to create a use case handler that is largely pass-through to an accessor/persistor. You could relax these rules in such situations, but then you have a dependency from your consumer to your accessor/persistor. If, at some time, the use case evolves, you need to make sure an use case handler is inserted at that point rather than the so-called "non-volatile" accessor/persistor being modified.

The other obvious pain point with this approach is **code bloat**. More services means more code, and that means more code to maintain. I think when you get to a system of a certain size, that volume of code becomes justifiable. So, there is a system size below which a lot of this is too much overhead. It is wise to identify that point and react accordingly. Perhaps better tooling could help, too - something tailored for building systems this way.

One problem I have with this - and in fact with SOA in general is that your system is made up of all these services that have logic distributed within them. If you decomposed by volatility and then by function, then granted - your logic is distributed properly. There still is no identiable "core" of the system where the "meat" is - so to speak. That is something that DDD addresses in my opinion. Hence my increasing interest in meshing DDD and SOA. [More on that later]({{< ref "ddd-meet-soa" >}}).