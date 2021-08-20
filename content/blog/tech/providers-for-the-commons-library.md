---
title: Providers for the Commons Library
slug: providers-for-the-commons-library
date: 2013-08-27
draft: false
tags:
- csharp
- dotnet
- architecture
---
A blog series on my [Commons Library]({{< ref "the-commons-library" >}}) would not be complete without mentioning all the providers that go with it. The Commons Library, by itself, gives you a framework, some common functionality and a bunch of contracts. To get actual functionality out of it, providers need to be built that implement those contracts. The Commons Library does contain a bunch of built-in providers as well. These built-in providers are ones that do not have any third-party dependency other than the .NET framework and the most common of its extensions; the idea being I do not want to impose a whole bunch of dependencies on the Commons Library itself. Other than these built-in providers, I have built other providers that do have third party dependencies. These are individual libraries that are available as NuGet packages.

Here is a quick mention of all providers that are in place as of this blog post.

#### Built-in Providers (bundled with the [library](http://aashishkoirala.github.io/commons/))
+ **Configuration Store**
 + One that uses XML files (`XmlFileConfigStore`)
 + One that uses web URLs (`WebUrlConfigStore`)
+ **Logging**
 + One that uses the console (`ConsoleLoggingProvider`)
 + One that writes to text files (`TextFileLoggingProvider`)
 + One that sends an e-mail every time you log (`EmailLoggingProvider`)

#### Individual Package Providers (read more on them [here](http://aashishkoirala.github.io/commons-providers/))
+ **Configuration Store**
 + One that uses Windows Azure Blog Storage (`BlogStorageConfigStore`)
+ **Logging**
 + One that uses Windows Azure Table Storage (`TableStorageLoggingProvider`)
+ **Data Access**
 + One that uses Fluent NHibernate (`FluentNHibernateUnitOfWorkFactory`)
 + One that uses MongoDB (`MongoDbUnitOfWorkFactory`)
+ **Web**
 + A bundling provider based on [Microsoft](http://www.nuget.org/packages/microsoft.aspnet.web.optimization/)
 + A SSO provider based on [DotNetOpenAuth](http://dotnetopenauth.net/)

I hope to build a lot more as I go, and you are welcome to build as many as you want as well. As always, feedback and suggestions for improvement are more than welcome.