---
title: Writing Your Own LINQ Provider- Part 1
slug: writing-your-own-linq-provider-part-1
aliases:
- /blog/writing-your-own-linq-provider-part-1
date: 2014-03-10
draft: false
tags:
- csharp
- dotnet
- linq
---
This is the first in a short series of posts on writing your own LINQ provider. While LINQ is the best thing that ever happened to .NET, and using it is so much fun and makes life so much easier, writing your own LINQ provider is "complicated" to say the least (context- the LINQ interface to NHibernate, RavenDB or Lucene - those are all providers).

A quick outline of the series:

1. **A primer** (*this post*)
2. [Provider basics]({{< ref "writing-your-own-linq-provider-part-2" >}})
3. [A simple, pointless solution]({{< ref "writing-your-own-linq-provider-part-3" >}})
4. [A tiny ORM of our own]({{< ref "writing-your-own-linq-provider-part-4" >}})

---

### A Primer
If you've used LINQ, you know there are two distinct syntaxes:

The "query" style:

	from item in items
	where item.Id == 2
	select item.Name

And the "method chaining" style:

	items.Where(item => item.Id == 2).Select(item ==> item.Name);

Except for the style, they're pretty much the same in that the former is really syntactic sugar that compiles down to the latter. Now, the latter, as we know, is a series of extension methods that become available when you import the namespace `System.Linq`. Within this, though, there are two flavors of LINQ that are very different in terms of their internals:

+ `IEnumerable<T>` and everything that supports it
+ `IQueryable<T>` and everything that supports it

This means that when you call the same LINQ methods on an `IEnumerable<T>` versus an `IQueryable<T>`, very different things happen.

#### `IEnumerable<T>` and everything that supports it
These are simpler to use in that all the work has already been done as part of the .NET Framework. You simply use it. If you want to extend this to a data source of your own, you simply build an enumerator for it (e.g. if you wanted to slap LINQ on top of flat files, you could build a `FileEnumerable` that uses a `FileEnumerator` that, in turn, deals with a `FileStream`).

The extension methods are defined in `System.Linq.Enumerable` and the way they work is: each method, when called, wraps the `IEnumerable` it's called on within a new implementation of `IEnumerable` that has knowledge of what operation is to be performed. These implementations are all private within the `Enumerable` class (e.g. `Where` on an array yields a `WhereArrayIterator`). When the final enumeration happens, the pipeline executes and gives you the desired result. The scalar-returning methods such as `Any` and `First` in this case are simple calls to the enumerator or `foreach` on top of the underlying enumerable.

All methods in this category deal with `Func`'s when it comes to predicates or mapping functions that are passed in.

#### `IQueryable<T>` and everything that supports it
This is the focus of this series. You'll notice that all methods in this category are defined within another class, `System.Linq.Queryable` and deal not with `Func`'s, but with `Expression<Func<>>`'s when it comes to predicates or mapping functions that are passed in. You use this when you are working with a data source that has its own way of extracting data that either does not yield well to the `IEnumerable` way of doing things, or its own way of extracting data is just better-suited or superior than just enumerating away using `IEnumerable`. An example is relational databases, where rather than enumerating throw each row in a table and applying predicates or mapping to it, you're better off running SQL.

The core idea here is to boil the method calls down into a lambda expression tree, then when the time comes to enumerate, parse that expression tree into something the underlying data source understands (using the relational database example, the expression tree needs to be parsed into SQL- that is what ORMs with LINQ providers such as NHibernate or Entity Framework do).

More on this to follow in future posts to come in this series.