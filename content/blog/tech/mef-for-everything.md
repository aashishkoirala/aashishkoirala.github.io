---
title: MEF for everything!
slug: mef-for-everything
aliases:
- /blog/mef-for-everything
date: 2013-08-07
draft: false
tags:
- mef
- csharp
- dotnet
---
In the first of a series of blogs around my [Commons Library]({{< ref "the-commons-library" >}}), I want to shed more light on my choice of MEF as the underlying mechanism for the `AK.Commons.Composition` namespace - which handles dependency injection **as well as** extensibility or plugin type stuff. I like its attribute based syntax, choice of different types of catalogs and dynamic discovery (and yes, I am not using dynamic discovery just yet but I intend to; the same goes for taking advantage of different types of catalogs). The following three features, however, stood out for me:

+ The fact that you can support **multiple cardinalities** - i.e. you can ask for one implementation of something, or many.

+ **Metadata attributes** - which you can use decorate your exports with additional metadata. This combines well with multiple cardinalities. I can have multiple providers that implement a single contract. I can then choose the ones I want based on their metadata properties. This is more of an extensibility thing than a DI thing - but you can also use this to introduce versioning into your DI mechanism. You could have multiple versions of something available and the consumer could ask for a specific version (or some predicate around the version). That can lend itself well to setting up a continuous deployment environment.

+ **Lazy imports** - oh how I love lazy imports. This lets you define imports that are resolved when the containing class is composed, but the actual value is not computed until it is needed for the first time. That gets me out of circular dependency hell with ease (and I know we should strive to structure things so that there aren't circular dependencies to begin with, but at times it is unavoidable).

One other factor is that MEF is part of the framework as opposed to being a third party library, and that Microsoft is behind it. That means one less third party dependency to deal with if you wanted to use [AK.Commons](https://www.nuget.org/packages/AK.Commons/). I already have this cool extensibility mechanism that is part of the framework, and it does what I need for DI. Why not use it for DI as well? I have heard the whole "MEF is not for DI" debate quite a bit. It has worked well for me so far though.

One thing I miss in MEF is support for AOP. I do intend to do something about that pretty soon though!