---
title: Writing Your Own LINQ Provider- Part 2
slug: writing-your-own-linq-provider-part-2
date: 2014-03-12
draft: false
tags:
- csharp
- dotnet
- linq
---
This is the second in a short series of posts on writing your own LINQ provider. A quick outline of the series:

1. [A primer]({{< ref "writing-your-own-linq-provider-part-1" >}})
2. **Provider basics** (*this post*)
3. [A simple, pointless solution]({{< ref "writing-your-own-linq-provider-part-3" >}})
4. [A tiny ORM of our own]({{< ref "writing-your-own-linq-provider-part-4" >}})

---

### Provider Basics
In the [previous post]({{< ref "writing-your-own-linq-provider-part-1" >}}), we took a look at the two flavors of LINQ methods, i.e. the methods and classes around `IEnumerable<T>` and the methods and classes around `IQueryable<T>`. In this post, we expand upon what happens when you call LINQ methods on `IQueryable<T>`, and how you can use that to build your own provider.

Once you have an instance of `IQueryable<T>`, you can do one of three things with it:

1. Enumerate it, using one of the following methods:
	1. Call a method such as `ToList`, `ToArray` or `ToDictionary` on it.
	2. Use it in a `foreach` loop.
	3. Call `GetEnumerator()` and then use the enumerator you get in the usual way.
2. Call a LINQ method that returns a scalar result (this also results in the queryable getting enumerated) such as `Any`, `First`, `All`, `Single`, etc.
3. Call a LINQ method (such as `Where`, `Select`, `OrderBy` etc.) that returns another `IQueryable` with some rules added that you can again do one of these very three things with.

For the first situation, `IQueryable` behaves just like any `IEnumerable` in that the `GetEnumerator()` method is called - so this is where you implement what you want to happen when the final enumeration happens. Usually, you do this by writing your own implementation of `IEnumerator<T>` for this purpose that you return from the `GetEnumerator()` method. 

For the remaining two situations, the `Provider` and `Expression` properties of `IQueryable<T>` come into play. When you implement `IQueryable<T>`, you need to implement the getter for the `Provider` property to return an implementation of `IQueryProvider<T>` that does what you want.

In both cases, here is what the LINQ methods do:

1. Create a lambda expression that represents the LINQ method call.
2. Get a reference to the `Provider` for the target `IQueryable<T>`.
3. For the first case, call `Execute` on the `IQueryProvider<T>` from step 2. For the second case, call `CreateQuery` on the 'IQueryProvider<T>` from step 2.
4. The only thing that is different across different LINQ methods is the type parameters that are passed in, e.g. `Any<T>` will call `Execute<bool>` while `First` will call `Execute<T>`. Similarly, `Where<T>` will call `CreateQuery<T>` while `Select<TSource, TResult>` will call `CreateQuery<TResult>`.

To drive the point home, here is the simplified source code for `Where<T>`:   

	public static IQueryable<T> Where<T>(
		this IQueryable<T> source, 
		Expression<Func<T, bool>> predicate)
	{
	    var currentMethodOpen = (MethodInfo) MethodBase.GetCurrentMethod();
	    var currentMethod = currentMethodOpen.MakeGenericMethod(new[] {typeof (T)});
	    var callArguments = new[] { source.Expression, Expression.Quote(predicate) };
	    var callExpression = Expression.Call(null, currentMethod, callArguments);
	
	    return source.Provider.CreateQuery<T>(callExpression);
	}

And here is the simplified source code for `Any<T>`:

    public static bool Any<T>(this IQueryable<T> source, Expression<Func<T, bool>> predicate)
    {
        var currentMethodOpen = (MethodInfo) MethodBase.GetCurrentMethod();
        var currentMethod = currentMethodOpen.MakeGenericMethod(new[] {typeof (T)});

        return source.Provider.Execute<bool>(Expression.Call(
			null, currentMethod, new[] {source.Expression}));
    }

Note how neither method body does anything specific to what a "Where" or "Any" operation should do. It just wraps that information in an expression and calls the appropriate method on the `Provider`. It is up to the provider to understand the expression (which is passed in as a parameter to both `CreateQuery` and `Execute`) and perform the correct operation. This is why when you build a LINQ provider, it is up to you to write the translation logic for each LINQ operation as it relates to your data source, or write a fallback that says "this operation is not supported."   

Creating a new LINQ provider, then, can be boiled down to the following steps:

**Step 1**

Create a class that implements `IQueryable<T>` (say, `YourQueryable<T>`).

1. There should be a way to construct this class and pass in some sort of an interface to the underlying data source to use (e.g. in NHibernate, `session.Query<T>` on the NHibernate `ISession` object does this).
2. The call to `GetEnumerator()` should return your implementation of `IEnumerator<T>`, (say, `YourEnumerator<T>`). It should be initialized with the value of `YourQueryable.Expression` at the time of the call.
3. The getter for the `Provider` property should return an instance of `IQueryProvider<T>` (say, `YourQueryProvider<T>`). The provider should have access to the underlying data source interface.

**Step 2: Option 1** 

The logic to parse the final expression can go in `YourEnumerator<T>`. In this case, `YourQueryProvider.CreateQuery` simply returns a new instance of `YourQueryable<T>` but with the `Expression` set to what is passed in to `CreateQuery`. The very first instance of `YourQueryable<T>` would then set the `Expression` to `Expression.Constant(this)`. This way, when the time comes to enumerate and you get to `YourEnumerator<T>`, you have an expression that represents the complete call chain. That is where you then put the hard part of parsing that so that the first call to `MoveNext` does the right thing against the underlying data source.

**Step 2: Option 2** 

Another option is to have a dumb `YourEnumerator<T>` and instead have a separate implementation of `IQueryable<T>` for each type of query operation to support (e.g. `WhereQueryable', `SelectQueryable', etc.) In this case, the parsing logic is spread out across these classes, and `YourQueryProvider.CreateQuery` needs to examine the expression then and there return the correct type of `IQueryable<T>` with all the necessary information wrapped within. In any case, though, the expression as a whole must be parsed before enumeration happens.

**Step 3**

`YourQueryProvider.Execute` then needs to have logic that parses the expression passed in, figures out what needs to be done and return the result. This may involve enumerating the underlying `IQueryable<T>`. Going back to an ORM that is based on SQL Server, say, you would need to know to generate an `WHERE EXISTS` clause if you spot an `Any` in the expression.

Now, granted, all of this sounds pretty convoluted and can be hard to get a grip on without an example. So, we will do just that in the next post. We will start with a simple but pointless solution that does LINQ just for the sake of LINQ. Then, we'll try to build a rudimentary ORM of our own.