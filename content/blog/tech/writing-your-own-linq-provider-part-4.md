---
title: Writing Your Own LINQ Provider- Part 4
slug: writing-your-own-linq-provider-part-4
aliases:
- /blog/writing-your-own-linq-provider-part-4
date: 2014-03-16
draft: false
tags:
- csharp
- dotnet
- linq
---
This is the last in a short series of posts on writing your own LINQ provider. A quick outline of the series:

1. [A primer]({{< ref "writing-your-own-linq-provider-part-1" >}})
2. [Provider basics]({{< ref "writing-your-own-linq-provider-part-2" >}})
3. [A simple, pointless solution]({{< ref "writing-your-own-linq-provider-part-3" >}})
4. **A tiny ORM of our own** (*this post*)

---

### A tiny ORM of our own
In the [previous post]({{< ref "writing-your-own-linq-provider-part-3" >}}), we took a look at a simple, albeit pointless example of a LINQ provider. We wrap the series up this time by looking at something a little less pointless - a LINQ-based ORM, albeit a very rudimentary one. As with the previous one, it helps to take a look at the source code first:

+ [**Click here for the source code for our tiny ORM**](https://github.com/aashishkoirala/snippets/tree/master/src/TinyOrm)

This is a very simple example implementation and has its limitations. It only works with SQL Server. It only supports reads. It only supports these methods:

+ Any
+ Count
+ First
+ FirstOrDefault
+ Select
+ Single
+ SingleOrDefault
+ Where
+ OrderBy
+ OrderByDescending
+ ThenBy
+ ThenByDescending

There are a few more limitations, but again the point is not to redo NHibernate or Entity Framework. There is also a simple fluent mapping interface that you can use as so:

	Mapper.For<MyThing>("my_thing_tbl")
	    .Member(x => x.Id, "id")
	    .Member(x => x.Name "thing_name")
	    .Member(x => x.Date "thing_date");

Once you've got your mappings in place, it is up to you to create the DB connection. Once you've done that, you can create an `IQueryable<T>` out of a `SqlConnection` instance and then do LINQ on top of it. 
	
	using (var conn = new SqlConnection("..."))
	{
	    conn.Profile(Console.WriteLine); // Write generated query to console.
	    conn.Open();

	    var query = conn.Query<MyThing>();
	
	    var things = query
	        .Where(x => x.Id < 1000)
	        .OrderBy(x => x.Name)
	        .Select(x => new {x.Id, x.Name, x.Date})
	        .ToArray();
	}

Or, using the "other" syntax:

	var things = (from item in query
					where item.Id < 1000
					orderby item.Name
					select new { item.Id, item.Name, item.Date }).ToArray();

If you recall **Step 2** from [provider basics]({{< ref "writing-your-own-linq-provider-part-2" >}}), there were two options. The [last solution]({{< ref "writing-your-own-linq-provider-part-3" >}}) used Option 1, i.e. there is one queryable that just builds up the expression and the enumerator does the parsing. For this one, we're using Option 2, where we have a separate implementation of `IQueryable<T>` for each type of query operation to support.

When you first obtain a queryable, you get an instance of `TableQueryable` (which is descended from `SqlQueryable`) corresponding to the table that the type is mapped to. Each call on top of it then wraps the queryable in another descedant of `SqlQueryable` (e.g. `WhereQueryable` for `Where` operations, and so on). This logic is in `SqlQueryProvider`. Similarly, for executable methods, the appropriate type of `ExecutableBase` is created and called. Beyond this, the actual query creation logic is implemented in the individual queryables and executables defined within the `Constructs` namespace.

The queryables and executables work with classes within the `QueryModel` namespace that represent parts of a SQL query. Based on what operation they stand for, they convert an `Expression` into a `Query`, which can then be converted into a SQL string. Each queryable implements a `Parse` method that does this, and as part of doing this, it parses the queryable it wraps and then works on top of the `Query` object returned by the inner `Parse`, and so on until the top-most enumerable gives you the final query. The innermost or leaf queryable is always `TableQueryable` which simply adds the name of the source table to the query model.

LINQ is undoubtedly awesome, but knowing how it works gives you new appreciation for just how powerful it can be. Man, I love LINQ.