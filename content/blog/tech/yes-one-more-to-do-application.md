---
title: Yes, One More To-Do Application
slug: yes-one-more-to-do-application
aliases:
- /blog/yes-one-more-to-do-application
date: 2013-12-02
draft: false
tags:
- csharp
- dotnet
---
> **UPDATE (2015/1/7)**

> This application has been re-written from scratch using some new stuff I learned. The new application is called **CHORE**. Understandably, the links to the application and source code as mentioned in the original post don't work anymore. I did not update them as I want the original post to stand as is. Here, however, are relevant links to the new application:

> The application is hosted [here](http://chore.apphb.com).

> The source code can be found [here](http://github.com/aashishkoirala/chore).

> More technical details can be found [here](http://aashishkoirala.github.io/chore).



Yes, I figured the one thing that the world really needs is one more [To Do](http://todo-17.apphb.com) application. Seriously, though, when I was working on [Finance Manager]({{< ref "finance-manager" >}}), I realized I made a few mistakes, specifically with the way I was doing Angular as well as building a REST API. I therefore wanted to build something simpler- yet something that I would personally use, and in the process try to do it "more right" and learn something in the process as well. I think two of the key new things I learned building this application was [routing](http://docs.angularjs.org/api/ngRoute.$route) with Angular and working with [MongoDB](http://www.mongodb.org/). I ended up building a [Mongo provider](https://www.nuget.org/packages/AK.Commons.Providers.DataAccess.MongoDb) for the [Commons Library]({{< ref "the-commons-library" >}}) as well. I also think this servers as a better example of how to marry TypeScript with Angular.

Here's a screenshot:

![Screenshot](/blog-images/yes-one-more-to-do-application-screenshot.png)

I had my complaints about [Astrid](http://www.astrid.com/), but was getting used to it when it got yanked out of existence all of a sudden by Yahoo (good for them, though). Rather than trying to go and look for something else that worked for me, I decided to build it and learn something in the process as well (which sits well with my thoughts on when to roll your own as a developer - probably a post on that soon to follow). With this application I can create nested categories, create tasks within those categories, give them due dates and start dates - and walk them through a work-flow of created, started, in progress and done (or just created and done - depending on what kind of task it is). Two features I really like that I missed in Astrid is the ability to bulk import tasks from plain text - and the ability to perform bulk actions.

This time, I also made sure I could actually deploy it to the cloud once I was done with it. It is deployed here, using [AppHarbor](https://appharbor.com/). Since I'm too cheap to want to pay for a To Do application, I'm using the free instance. I intend to use this for my own personal use, but if you plan to use it - be aware that this is a free, development instance and could disappear tomorrow. I would love it, however, if you wanted to look around and offer me feedback.

Again, the application is deployed [here](http://todo-17.apphb.com), and the source code can be found [here](http://github.com/aashishkoirala/todo). More technical details can be found [here](http://aashishkoirala.github.io/todo/).

Other than the obvious gaps to fill (as marked by the many "TODO"s in the source code), one thing I definitely want to do at some point is build a mobile front-end to this - and also make the web UI use responsive layout (if you open the web application in a phone, it looks really messed up). Then there is always that colossal task of going back and fixing mistakes I made with [Finance Manager]({{< ref "finance-manager" >}}).