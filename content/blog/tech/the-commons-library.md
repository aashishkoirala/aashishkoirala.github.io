---
title: The Commons Library
slug: the-commons-library
aliases:
- /blog/the-commons-library
date: 2013-08-02
draft: false
tags:
- csharp
- dotnet
- architecture
---
A commons library is something I've always tried to maintain. The idea is you have something of your own that handles (or at least provides a way to handle) common cross-cutting concerns in all applications that you build. This includes areas such as configuration, logging, security, error handling, data access, dependency injection and caching to name a few. As long as it is kept up to date, it is also a good way to keep up to date with new technologies in these areas. My last attempt at a commons library was during my .NET 2 days - and it worked pretty well for applications that I built back then. I realized recently that I hadn't really kept it up to date and as a result was not using it. So, I decided to scrap it and build something from scratch that would take advantage of the latest and the greatest that's out there (that being .NET 4.5 as of now).

One of my key goals was to make the library itself more of a set of contracts, without any dependencies - so that I did not marry myself to any specific technology. Instead, the library would just provide a way for consuming applications to do certain things. I could then build providers that implement these contracts and use various technologies to get the job done. This way, as new technologies emerge, I can incorporate them into my applications by building and hooking up new providers while everything else remains the same. I decided to use MEF as the mechanism to do this - and it also serves as a good dependency injection provider.

The library is called **AK.Commons** and with its first release is very much in its infancy. It gets the job done for what I need to do today - but I'm pretty sure I will need to add to it quite a bit as I go along. This time around, to make sure I stay engaged in maintaining this (and possibly to gather input and feedback from the community), I have decided to release it on [Nuget](http://www.nuget.org/packages/ak.commons/), open source the code on [GitHub](http://github.com/aashishkoirala/commons/), and also put up some [documentation](http://aashishkoirala.github.io/commons/).

Over the next few days, I intend to blog some more about the library- particularly my thought process around each concern that the library supports, along with details on some of the providers, my applications that actually use this - and also my plans for the library for the future- a roadmap if you will. Usage and forks of the library and feedback on it is welcome and much appreciated.
