---
title: Writing Your Own LINQ Provider- Part 3
slug: writing-your-own-linq-provider-part-3
aliases:
- /blog/writing-your-own-linq-provider-part-3
date: 2014-03-15
draft: false
tags:
- csharp
- dotnet
- linq
---
This is the third in a short series of posts on writing your own LINQ provider. A quick outline of the series:

1. [A primer]({{< ref "writing-your-own-linq-provider-part-1" >}})
2. [Provider basics]({{< ref "writing-your-own-linq-provider-part-2" >}})
3. **A simple, pointless solution** (*this post*)
4. [A tiny ORM of our own]({{< ref "writing-your-own-linq-provider-part-4" >}})

---

### A simple, pointless solution
In the [previous post]({{< ref "writing-your-own-linq-provider-part-2" >}}), we took a look at what happens when you call LINQ methods on `IQueryable<T>`, and how you can use that to build your own provider. We take that a step further this time by building an actual provider - albeit a somewhat pointless one, in that it adds LINQ support to something that doesn't really need it. The point, though, is to keep it simple and try to understand how the process works.

The best way to understand is to take a look at the source code first:

+ [**Click here for the source code for our solution**](https://github.com/aashishkoirala/snippets/tree/master/src/NextProviderLinqProvider)

Now, a quick summary of what this is.

We have an interface, `INextProvider`. It has one method, `GetNext` that is supposed to get the next one in a sequence of items. An example implementation that uses a simple array as the underlying store is also included. Once you have an instance of `INextProvider<T>`, say, called `nextProvider`, you can then extract an `IQueryable<T>` out of it with this call:

	var query = nextProvider.AsQueryable();

You can then use standard LINQ on top of it. Now, I know what you're thinking: this `INextProvider` seems uncomfortably similar to `IEnumerator` - why would we need a query provider for this? We don't, hence the "pointless" part, but again - the idea is to examine how building a provider works.

The entry point is `NextProviderQueryable` which implements `IQueryable<T>` and uses `NextProviderQueryProvider` as its `Provider` and returns a `NextProviderEnumerator` from its `GetEnumerator()` call. This means that whenever one of the LINQ methods are called on an instance of `NextProviderQueryable`, one of the following happens:

+ If the method is something that creates another queryable out of the existing one (e.g. `Where`, `Select`, `SelectMany`, `Cast`, etc.), `NextProviderQueryProvider.CreateQuery()` is called. That, in turn, creates a new instance of `NextProviderQueryable`, but with the `Expression` set to what has been passed in. Thus, every call to `CreateQuery` ends up creating a new queryable with the `Expression` property representing the complete call.

+ If the method is something that enumerates a queryable (e.g. `ToList`, `ToArray`, etc. or a `foreach` loop), the `GetEnumerator()` method is called and enumeration starts. This means that `NextProviderEnumerator` takes place. This object is initialized with the current value of `Expression` as of the time of enumeration, thus it has complete information to parse it, figure out what needs to be done, and then do it using the `INextProvider` that it is assigned. The class `ExpressionParser` is used to convert the expression into a series of "nodes" that act on each item in the underlying `INextProvider` and do the appropriate thing based on what it is (e.g. if it's a `WhereNode`, it will have a predicate that it will run on each item).

+ If the method is something that returns a scalar (e.g. `Any`, `All`, `First`, etc.), `NextProviderQueryProvider.Execute` is called. In our case, we simply pass control to `NextProviderEnumerator` to enumerate as mentioned in the previous point, and then perform the appropriate action. We do this by getting an `IEnumerable<T>` that uses `NextProviderEnumerator` as its enumerator (and that is the `NextProviderEnumerable` class), and then calling the appropriate `IEnumerable` version of the `IQueryable` method that has been called. All of this is handled by the `ExpressionExecutor` class.

As of now, only the following methods are supported: `All`, `Any`, `Cast`, `Count`, `Distinct`, `ElementAt`, `ElementAtOrDefault`, `First`, `FirstOrDefault`, `Last`, `LastOrDefault`, `LongCount`, `OfType`, `Select`, `SelectMany`, `Single`, `SingleOrDefault`, `Skip`, `Take` and `Where`. If you try to use any other methods, you will get an exception. Even within these methods, if you try to use a variant that is not supported, you will get an exception.

Next time, we'll try our hands at a more real world implementation, i.e. a tiny, tiny ORM.