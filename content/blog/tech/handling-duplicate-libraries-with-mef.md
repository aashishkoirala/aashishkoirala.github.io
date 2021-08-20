---
title: Handling Duplicate Libraries with MEF
slug: handling-duplicate-libraries-with-mef
aliases:
- /blog/handling-duplicate-libraries-with-mef
date: 2013-08-09
draft: false
tags:
- mef
- csharp
- dotnet
---
While building the composition/DI piece for the [Commons Library](http://aashishkoirala.github.io/commons/), one problem I ran into was the fact that if you told MEF to load assemblies from a number of different places - and they all had copies of the same library (which is possible especially with common dependencies), MEF would load the exports in each assembly as many times as it finds it. What you end up with then is a whole bunch of matching exports for a contract that you expect only one of.

One easy way to handle this is to assume that `FullName` for an assembly truly uniquely identifies it (i.e. the code within two instances of an assembly with the same `FullName` should not be different). We can then do something like the following (assume here that `modulesDirectories` is an `IEnumerable<string>` that consists of the list of directories we want to load our assemblies from).

	var assemblyFiles = new List<string>();
	foreach (var modulesDirectory in modulesDirectories)
	{
	  using (var directoryCatalog = new DirectoryCatalog(modulesDirectory))
	  assemblyFiles.AddRange(directoryCatalog.LoadedFiles);
	}
	 
	var assemblyCatalogs = assemblyFiles
	  .Distinct()
	  .Select(Assembly.LoadFrom)
	  .Distinct(new AssemblyEqualityComparer())
	  .Select(x => new AssemblyCatalog(x))
	  .ToList();
	 
	var container = new CompositionContainer(new AggregateCatalog(assemblyCatalogs));

In the above snippet, we use a class `AssemblyEqualityComparer`, which can be defined as follows:

	private class AssemblyEqualityComparer : IEqualityComparer<Assembly>
	{
	  public bool Equals(Assembly x, Assembly y)
	  {
	    return x.FullName == y.FullName;
	  }
	  
	  public int GetHashCode(Assembly obj)
	  {
	    return obj.GetHashCode();
	  }
	}

You can find the full Commons Library code implementation for this [here](https://github.com/aashishkoirala/commons/blob/master/src/AK.Commons/Providers/Composition/Composer.cs).

