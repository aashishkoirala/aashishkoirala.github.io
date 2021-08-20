---
title: Reader-Writer Locking with Async-Await
slug: reader-writer-locking-with-async-await
date: 2017-12-20
draft: false
tags:
- csharp
- dotnet
- threads
- async
- await
---
Consider this another pitfall warning. If you are a frequent user of [reader/writer locking]({{< ref "reader-writer-locking-in-dotnet" >}}) (via the [`ReaderWriterLockSlim`](https://docs.microsoft.com/en-us/dotnet/api/system.threading.readerwriterlockslim?view=netframework-4.7.2) class) like I am, you will undoubtedly run into this situation. As more and more code we write these days are asynchronous with the use of `async/await`, it is easy to end up in the following situation (an oversimplification, but just imagine write locks in there as well):

	async Task MyMethod()
	{
		...
		myReaderWriterLockSlim.EnterReadLock();
		var thing = await ReadThingAsync();
		... 
		myReaderWriterLockSlim.ExitReadLock(); // This guy will choke.
	}

This, of course, will not work. This is because reader/writer locks, at least the implementation in .NET, are *thread-affine*. This means the very same thread that acquired a lock must be the one to release it. As soon as you hit an `await`, you have dispatched the rest of the behavior to some other thread. So this cannot work.

This explains why other thread-synchronization classes such as `SemaphoreSlim` are not async/await savvy with methods like `WaitAsync` but not `ReaderWriterLockSlim`.

So, what are our options?

1. Carefully write our code such that whatever happens between reader/writer locks is always synchronous.
2. Relax some of the rules around reader/writer locking that requires it to be thread-affine and roll your own.
3. Look for an already existing, widely adopted, mature library that handles this very scenario.

In the spirit of Option 3, [Stephen Cleary](https://blog.stephencleary.com/) has an [AsyncEx](https://github.com/StephenCleary/AsyncEx) library that includes this functionality and many others geared towards working efficiently with `async/await`. If that is too heavy-handed, may I suggest [this post](https://blogs.msdn.microsoft.com/pfxteam/2012/02/12/building-async-coordination-primitives-part-7-asyncreaderwriterlock/) by [Stephen Toub](https://github.com/stephentoub) that lays out a basic implementation that you can build upon?  
