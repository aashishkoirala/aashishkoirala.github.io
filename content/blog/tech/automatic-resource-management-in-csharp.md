---
title: Automatic Resource Management in C#
slug: automatic-resource-management-in-csharp
date: 2012-02-27
draft: false
tags:
- csharp
- dotnet
---
Both the .NET framework and Java are garbage-collected systems. This means that when you instantiate objects, the framework keeps track of how the object is being referenced, and automatically frees up memory used by the object when it is no longer referenced by anything and is “out of scope”. This works beautifully with objects that are part of the framework. In .NET lingo, these are called “managed resources”. However, a lot of times, a .NET or Java application needs to talk to other systems external to the framework – such as databases, file systems, network sockets, graphics engines, and so on – i.e. “unmanaged resources”. In such cases, it is up to the programmer to handle allocation and de-allocation of resources. Framework classes that provide access to such resources will usually provide routines to close or dispose of resources. However, the programmer still needs to write boilerplate in order to do it and the boilerplate usually becomes cumbersome when you take into account things like exception handling.

The .NET framework provided an answer to this problem with the introduction of the using keyword for resource management in .NET 3.5. A similar mechanism has since been introduced in Java 7. This text focuses on the .NET implementation, particularly C#, and then follows that up with an example from Java as well.

#### The IDisposable Interface in C#
This has been around since before .NET 3.5. Classes that provide access to unmanaged resources are recommended to implement the System.IDisposable interface:

    public interface IDisposable
    {
        void Dispose();
    }

In the implementation of the Dispose method, the class author needs to write code that will free up all unmanaged resources instantiated by the class during its life cycle. Furthermore, there is a specific pattern that should be followed when working with this interface. The pattern is outlined in detail in [MSDN](http://msdn.microsoft.com/en-us/library/system.idisposable.aspx).

All framework classes that access unmanaged resources (such as I/O classes and database connection APIs) implement this interface and follow the recommended pattern.

#### The Boilerplate Problem
Consider a class `MyDisposable` that accesses unmanaged resources and implements `IDisposable`. A typical usage scenario would look something like this:

	...
	MyDisposable d = new MyDisposable();
	...
	d.SomeMethod();
	...
	d.Dispose();
	...

However, there is no guarantee here that the call to `Dispose` will be executed. There may be branches that return from the method. There may be errors that are uncaught. In such cases, this will lead to resources not being freed and lead to memory creep.

For error-handling, this calls for something along the lines of:

    MyDisposable d = new MyDisposable();
    try
    {
        ...
        d.SomeMethod();
        ...
    }
    catch(TypedException ex1)
    {
        ...
    }
    catch(Exception ex2)
    {
        ...
    }
    finally
    {
        d.Dispose();
    }
    ...

If there are multiple exit-points in the method, then the programmer needs to make sure that `Dispose` is called before each of those points are reached. Alternatively, the programmer would need to structure the whole routine so that the method has only one exit-point. In any case, this leads to a lot of plumbing that the programmer needs to do and almost defeats the purpose of having a garbage-collected system when working with unmanaged resources.

#### The Answer – The using Keyword for Use with IDisposable
Starting with C# 3.5, the above construct can be written as follows:

    using(MyDisposable d = new MyDisposable())
    {
        ...
        d.SomeMethod();
        ...
    }

Any class that implements `IDisposable` can be used in the above fashion. When used this way, as soon as the flow of control exits the using block, the `Dispose` method is called without doubt. Even if there is an uncaught error that causes the block to be exited out of, the `Dispose` method will be called. This makes for a cleaner, more concise, more maintainable and safer code in terms of resource usage.

Starting with .NET 3.5, therefore, it is best practice to use the above pattern when dealing with unmanaged resources.

#### ARM in Java 7
With Java 7, something similar has been introduced where you can use the try keyword with classes that implement the java.lang.AutoCloseable interface, for example:

    try(MyCloseable c = new MyCloseable()) {
        ...
        c.someMethod();
        ...
    }

Hopefully, with Java 7, this will free Java developers from having to write a lot of painful boilerplate and finally blocks for resource management. This is a good example of the .NET and Java communities learning from and feeding into each other.