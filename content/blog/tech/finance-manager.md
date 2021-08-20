---
title: Finance Manager
slug: finance-manager
aliases:
- /blog/finance-manager
date: 2013-09-04
draft: false
tags:
- csharp
- dotnet
---
A bunch of things I've been working on and have blogged about have culminated into an actual application that uses all of it. [Finance Manager](http://aashishkoirala.github.io/financemanager/) is a SPA web application I built for my own use to keep track of my finances. This application allows me to create periodic budgets and record all my transactions. I can then look at my budgeted versus actual amounts based on those transactions. This was already something I was doing with Excel spreadsheet. I took what I was doing and created a domain model out of it, and built this application around it. It is not quite feature complete and not deployed anywhere yet, but I have [open sourced](http://github.com/aashishkoirala/financemanager) the code.

Here's a quick screenshot of the Transactions tab:

![Screenshot](/blog-images/finance-manager-screenshot.png)

I considered deploying this application on [AppHarbor](https://appharbor.com/), but I found that while the application in its current state works for me personally, it is not quite ready to be deployed, for a few reasons:

+ It is not quite cloud ready in terms of TypeScript and NuGet settings, configuration, logging, etc.
+ It is not quite ready for the general public in terms of features:
 + You can't sign up as a new user and create your own workbook.
 + The "Setup" tab that would let you set up lookup values for a workbook has not been built yet.
 + There is no "Administration" interface that I could use for user management.
 + I haven't had time to put together a nifty landing page.

I do plan to work on all the above issues and at some point make this application available on the cloud though.

Back to the application itself, in terms of general architecture, it's a pretty small application - there's a small data access layer with a service layer on top of it. The services are built so as to communicate in terms of data contracts that represent REST resources. The web application then consists of a small MVC component that renders the initial view. The rest of actual data in/out happens through a REST API that is called by a JavaScript-heavy frontend.

In terms of implementation/technologies, the application uses:

+ [The Commons Library]({{< ref "the-commons-library" >}})- and therefore MEF for DI and extensibility, and [providers]({{< ref "providers-for-the-commons-library" >}}) as needed
+ XML file based [configuration]({{< ref "configuration-in-the-commons-library" >}}) store provider and text file based [logging]({{< ref "logging-in-the-commons-library" >}}) provider
+ A SQL Server database accessed using the Fluent NHibernate [data access]({{< ref "data-access-in-the-commons-library" >}}) provider
+ A T4 based [modeling kit]({{< ref "modeling-dsl-and-t4-ramblings" >}}) to generate entities and repositories from JSON models
+ Web application based on ASP.NET MVC and a REST API using ASP .NET Web API
+ Frontend based on [TypeScript, AngularJS and Bootstrap]({{< ref "typescript-angularjs-and-bootstrap-the-killer-combo" >}})
+ Web based SSO using Google authentication provided by DotNetOpenAuth

So, there you go, I put it all together.