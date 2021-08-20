---
title: RudyMQ- A Rudimentary Message Queue for Windows
slug: rudymq-a-rudimentary-message-queue-for-windows
date: 2014-02-11
draft: false
tags:
- csharp
- dotnet
- wcf
- messagequeue
---
For some odd reason out of the blue, I got this hankering to build a message queue (albeit rudimentary - hence the name) from scratch. I've been working with MSMQ for a while now, mostly as a transport for WCF. As cool as it is, it can really get on your nerves at times. It is an enterprise grade product, after all, which means there are a lot of dials you can turn. If something is not right, you'll get an error. If your experience has been the same as mine, you will recognize the dreaded *insufficient resources* error that MSMQ gives you for almost any of a thousand things that can go wrong.

That got me thinking that if in most cases, I don't really need all the enterprise grade features of MSMQ, a simpler managed-code version may suffice. .NET gives you many varieties of queue or queue-type data structures that one could leverage and combine with something like WCF to build a message queue. The only serious issues you would have to deal with, I guess, would be concurrence and performance. The use of read-write locks greatly helped with both, and as foolish as it was of me to not keep a record of the performance test results around, I remember thinking to myself at the time - "hey, this thing is handling a reasonable amount of concurrent load pretty nicely." That's good enough for me, is it not good enough for you (smirk)?

Anyway, you can find more details [over here](http://aashishkoirala.github.io/rudymq/). Feedback appreciated as always.

As I think back, I think it took me longer to get the WCF binding working than the actual message queue itself. If you think just using WCF is a chore, try building your own channels. The lack of available documentation online and how to get something like this working end-to-end was shocking. So, that - I believe - is another blog post in the works.