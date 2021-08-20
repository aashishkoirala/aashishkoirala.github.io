---
title: Logging in the Commons Library
slug: logging-in-the-commons-library
aliases:
- /blog/logging-in-the-commons-library
date: 2013-08-20
draft: false
tags:
- csharp
- dotnet
- architecture
---
My major goals when building the logging block for the [Commons Library]({{< ref "the-commons-library" >}}) were to keep the logging interface simple (just tell me what level, I will give you the message to log - don't make me think too much), be able to log to multiple places (i.e. logging providers), and for the logging operation itself to be asynchronous (i.e. the only latency any logging should add is a memory operation).

With that, I believe what is now in place meets all of these. You get a MEF imported instance of `IAppLogger` which has simple `Info, Error, Warning, Verbose` methods that you can use to log messages or exceptions. Everything you log goes into a queue. When you initialize an application, a log queue thread is started which processes the queue, handles all common logging stuff (i.e. figure out what the configured logging level is and whether this entry should be logged at all based on that, construct a `LogEntry` object with all the information needed for each individual provider to do its thing, etc.), and dispatches the entry to all configured logging providers.

All logging providers are sent log entries. So it is up to each logging provider to maintain some sort of an "Enabled" property that it uses to log or not log. Built in is a console based provider and a very simple text file provider. Possibilities for other providers include one that writes to a database, one that sends it to a web service or WCF endpoint, one that sends it to Azure Table Storage, one that passes it on to another logging provider like log4net or NLog, or maybe one that sends out an e-mail even.

In any case, I believe for now it meets my needs. Technical details can be found in the Logging section [here](http://aashishkoirala.github.io/commons/). Again, feedback and suggestions for improvement are most welcome.