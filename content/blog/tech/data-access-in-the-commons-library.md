---
title: Data Access in the Commons Library
slug: data-access-in-the-commons-library
aliases:
- /blog/data-access-in-the-commons-library
date: 2013-08-25
draft: false
tags:
- csharp
- dotnet
- architecture
---
The data access block in the [Commons Library]({{< ref "the-commons-library" >}}) is based on the *Unit of Work* and *Repository* patterns - or at least my take on them.

#### Unit of Work

You start with a unit-of-work factory (which is an implementation if `IUnitOfWorkFactory`) and call `Create` on it to get an instance of `IUnitOfWork` which is also `IDisposable`. So, you get a unit-of-work and do your business inside a `using` block, and call `Commit` before you leave the block. Methods in `IUnitOfWork` are all based on working with a specific entity type (which is just a POCO with an identifier field) and uses LINQ and `IQueryable` - makes it easy to use as a consumer, but also makes it easy to implement providers as most providers worth their salt already have a LINQ interface. As of the time of this writing, I've written two providers - one based on Fluent NHibernate and one based on MongoDB.

The unit-of-work factory is where the DB configuration and initialization takes place. All settings are retrieved from the commons library configuration block. You can use multiple providers and give them different names. You can then access each factory using a MEF imported instance of `IAppDataAccess` which lets you access it like a dictionary with the key being the name you used during configuration.

So, given an instance of `IAppDataAccess` called, say, `appDataAccess` and assuming you have a provider configured with the name "MyDB", a typical unit-of-work operation looks as follows:

	using (var unit = appDataAccess["MyDB"].Create())
	{
		// ... Do your thing on "unit".
	
		unit.Commit();
	}

#### Repositories

As far as repositories are concerned, they're light-weight wrappers around a unit-of-work tailored for a specific entity. Given an entity `Foo` with an integer identifier, you would have an `IFooRepository` that is essentially just `IRepository<Foo, int>` implemented by a `FooRepository` that is `RepositoryBase<Foo, int>`. You can, of course, extend it with other methods to implement different queries and such - but I rarely find the need, and I prefer such logic live in the services. Thus, repositories become more of a convenience than anything else - in my applications, I auto-generate all repositories using my [Modeling Kit](http://aashishkoirala.github.io/modeling/).

Technical details can be found in the Data Access section [here](http://aashishkoirala.github.io/commons/). As usual, feedback and suggestions for improvement are most welcome.