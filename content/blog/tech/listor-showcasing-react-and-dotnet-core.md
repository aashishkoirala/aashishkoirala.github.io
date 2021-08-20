---
title: Listor- Showcasing React and .NET Core
slug: listor-showcasing-react-and-dotnet-core
aliases:
- /blog/listor-showcasing-react-and-dotnet-core
date: 2017-11-20
draft: false
tags:
- react
- dotnetcore
- aspnetcore
- es6
- spa
---
For both [React](https://reactjs.org/) and for [.NET Core](https://docs.microsoft.com/en-us/dotnet/core/) (specifically [ASP.NET Core](https://www.asp.net/core/overview/aspnet-vnext) and [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)), I got sick of playing around with little prototypes and decided to build an application. [Listor](https://github.com/aashishkoirala/listor) is my first proper application I have built using both these technologies. It is a simple list-maker application- nothing fancy. But I have been using it since I put it up and it has come in handy quite a bit.

I am quite impressed with .NET Core (or I should say "the new .NET" - to mean not just the .NET Core runtime, but .NET Standard, the new project system, ASP.NET Core, EF Core, and let's say even the latest language improvements to C#). So much so, that it is going to suck a bit going back to writing traditional .NET Framework stuff for my day job.

My journey with React was much more convoluted. I started with it, took some time getting into the whole idea of JSX, but eventually was quite impressed by it. Then I got into the rabbit hole of setting up the environment, boilerplates, and then [Flux](https://facebook.github.io/flux/docs/overview.html) and then [Redux](https://redux.js.org/) - and then I got jaded real fast. I had to then reset myself back into vanilla React to see if I could just get stuff done with it. As far as this little application is concerned, it did the job nicely. I used [create-react-app](https://github.com/facebook/create-react-app) to set it up.

EF Core worked out nicely for this application - I am not doing anything crazy anyway, so those basic use cases are already nicely covered. In terms of the build process, rather than treat the build output of the client application as content and simply use something like `app.UseFileServer()`, I opted to go with compiling them as embedded resources, and built an [`AssetServer`](https://github.com/aashishkoirala/listor/blob/master/AK.Listor/AssetServer.cs) middleware that would cache it in-memory and serve it out fast. Again, I didn't have to, but it turned out okay.

I am using [Let's Encrypt](https://letsencrypt.org/) for TLS, so the other middleware I put in place is a [`HttpsVerifier`](https://github.com/aashishkoirala/listor/blob/master/AK.Listor/HttpsVerifier.cs) that I could use to easily set up an [ACME](https://en.wikipedia.org/wiki/Automated_Certificate_Management_Environment) verification endpoint for when I renew the certificate.

All in all, the application turned out to be useful, and I think it will serve as a nice playground for when I need to try out new technologies as they come out.

Listor the application is hosted at [listor.aashishkoirala.com](https://listor.aashishkoirala.com).
The source code can be found [on GitHub over here](https://github.com/aashishkoirala/listor).
