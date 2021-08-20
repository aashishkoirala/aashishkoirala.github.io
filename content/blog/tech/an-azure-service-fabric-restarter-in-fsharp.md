---
title: An Azure Service Fabric Restarter in F#
slug: an-azure-service-fabric-restarter-in-fsharp
aliases:
- /blog/an-azure-service-fabric-restarter-in-fsharp
date: 2017-03-15
draft: false
tags:
- fsharp
- functionalprogramming
- railwayorientedprogramming
- azure
- servicefabric
---
Trying to get beyond just writing quick scripts here and there in F#, I went through functional design patterns targeted at building mainstream applications. [Railway-oriented programming](https://fsharpforfunandprofit.com/rop/) specifically stuck with me. I decided to try it along with some of the other core functional concepts such as projecting to other domains with *map* and *bind* operations. My first foray into this was applying it to, surprise, surprise, yet another quick script I had in place. This one was something I had put together already using F# to recycle all code packages for a given application running on [Azure Service Fabric](https://azure.microsoft.com/en-us/services/service-fabric/).

Thus what was one end-to-end script became three distinct modules, as implemented in three different files:

- **Core.fs**: Core constructs and utility functions. [Source code here](https://github.com/aashishkoirala/snippets/blob/master/src/AzureServiceFabricApplicationRestarter/Core.fs).
- **Client.fs**: Service Fabric client. [Source code here](https://github.com/aashishkoirala/snippets/blob/master/src/AzureServiceFabricApplicationRestarter/Client.fs).
- **Main.fs**: Main executable that invokes the client in order to do the restart. [Source code here](https://github.com/aashishkoirala/snippets/blob/master/src/AzureServiceFabricApplicationRestarter/Main.fs).

The full source code is in [this repository](https://github.com/aashishkoirala/snippets/tree/master/src/AzureServiceFabricApplicationRestarter).
