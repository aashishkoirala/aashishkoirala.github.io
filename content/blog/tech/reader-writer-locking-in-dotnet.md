---
title: Reader Writer Locking In .NET
slug: reader-writer-locking-in-dotnet
aliases:
- /blog/reader-writer-locking-in-dotnet
date: 2014-02-18
draft: false
tags:
- csharp
- dotnet
- threads
---
Quite often people turn to the [`lock`](http://msdn.microsoft.com/en-us/library/c5kehkcz.aspx) statement when protecting access to shared resources from multiple threads. A lot of times, though, this is too big of a hammer. This is because to maintain the integrity of the lock, any access of the protected resource, be it simply accessing its value or modifying it, needs to be done within the lock. This means even concurrent reads get serialized. A lot of times, what you need is for concurrent reads to be possible as long as they read a consistent value, while writes are serialized.

This is exactly what reader/writer locking is for. I ran into the same scenario while building [RudyMQ]({{< ref "rudymq-a-rudimentary-message-queue-for-windows" >}}) and the framework class [`ReaderWriterLockSlim`](http://msdn.microsoft.com/en-us/library/system.threading.readerwriterlockslim(v=vs.110).aspx) class came in handy (in case you're wondering about the "slim" in the name, this class is supposed to be a slimmed down, more efficient version of the now somewhat deprecated [`ReaderWriterLock`](http://msdn.microsoft.com/en-us/library/system.threading.readerwriterlock(v=vs.110).aspx) class).

Here is a very simplified rundown of how `ReaderWriterLockSlim` works. Given an object `rwls` of type `ReaderWriterLockSlim`:

	// This will block if another thread has entered a write lock
	// on "rwls".
	rwls.EnterReadLock();
	
	try
	{
	    // Read value of protected resource here.
	    // While here, all calls to "rwls.EnterWriteLock()" will be blocked.
	}
	finally
	{
	    rwls.ExitReadLock();
	}
	
And similarly for writes:

    // This will block if another thread has entered a read OR write lock
    // on "rwls".
    rwls.EnterWriteLock();

    try
    {
        // Write/modify protected resource here.
        // While here, all calls to "rwls.EnterWriteLock()" and 
		// "rwls.EnterReadLock()" will be blocked.
    }
    finally
    {
        rwls.ExitWriteLock();
    }

Now, as easy as that is, that is just a little more boilerplate than I'm willing to write. Also, `ReaderWriterLockSlim` is an `IDisposable`, which brings with it all the boilerplate associated with that whenever you have to manage one or more instances of it.

My solution was to create a monadish wrapper around this called, say, `LockedObject<T>`, that handles all that, and wraps the actual protected resource along with an accompanying lock instance, something along the lines of:

	public class LockedObject<T>
	{
	   private readonly ReaderWriterLockSlim readerWriterLockSlim;
	   private T value;
	   
	   public LockedObject(T value)
	   {
	       this.value = value;
	       this.readerWriterLockSlim = new ReaderWriterLockSlim();
	   }
	
	   // ... IDisposable related boilerplate
	  
	   // An overload of this using Action<T> not shown.
	   public TResult ExecuteRead<TResult>(Func<T, TResult> action)
	   {
	       this.readerWriterLockSlim.EnterReadLock();
	
	       try
	       {
	           return action(this.value);
	       }
	       finally
	       {
	           this.readerWriterLockSlim.ExitReadLock();
	       }
	   }
	
	   // An overload of this using Action<T> not shown.
	   public TResult ExecuteWrite<TResult>(Func<T, TResult> action)
	   {
	       this.readerWriterLockSlim.EnterWriteLock();
	
	       try
	       {
	           return action(this.value);
	       }
	       finally
	       {
	           this.readerWriterLockSlim.ExitWriteLock();
	       }
	   }
	
	   public void Update(T newValue)
	   {
	       this.ExecuteWrite(v => this.value = newValue, timeout);
	   }
	}

 
For strictly value-based types and primitive types, we could take this one step further and create a `LockedValue<T>` that looks like:

    public class LockedValue<T> : LockedObject<T> where T : struct
    {
        public LockedValue(T value) : base(value) {}

        public T Value
        {
            get { return this.ExecuteRead(v => v); }
            set { this.Update(value); }
        }
    }

When you think about how those classes can then be used, I think it cuts down on quite a bit of the boilerplate - and that is usually good.

**UPDATE**

I am working on building these classes into the [Commons Library]({{< ref "the-commons-library" >}}). You can find the full source code for these classes as follows:

+ [Source code for `LockedObject`](https://github.com/aashishkoirala/commons/blob/develop/src/AK.Commons/Threading/LockedObject.cs)
+ [Source code for `LockedValue`](https://github.com/aashishkoirala/commons/blob/develop/src/AK.Commons/Threading/LockedValue.cs)