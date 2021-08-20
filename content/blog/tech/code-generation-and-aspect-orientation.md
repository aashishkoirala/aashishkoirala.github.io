---
title: Code Generation And Aspect Orientation
slug: code-generation-and-aspect-orientation
date: 2014-02-26
draft: false
tags:
- csharp
- dotnet
- aop
- architecture
- modeling
---
> **TL;DR**
> 
The [CodeDOM](http://msdn.microsoft.com/en-us/library/y2k85ax6(v=vs.110).aspx) is a cool library within .NET that can be used for structured code generation and compilation. When combined with [Reflection](http://msdn.microsoft.com/en-us/library/system.reflection(v=vs.110).aspx), one neat application is to be able to inject [aspects](http://en.wikipedia.org/wiki/Aspect-oriented_programming) into your code at run-time. I have created [Aspects for .NET](http://aashishkoirala.github.io/aspects/), a library that does just that, and also tries to bring AOP to MEF.

Whether it be generating boilerplate, generating proxy classes or processing DSL, code generation has numerous applications. There are a few different options for code generation in .NET:

**T4:** With [T4](http://msdn.microsoft.com/en-us/library/bb126445.aspx) you create text templates that consist of literal text and "special" text that gets compiled, run and the output of the run inserted into the template to create the final output (a-la ASPX/Razor, etc.) If you need to generate code at design time off a model or DSL, this is your best bet. You can extend the T4 library and write stuff that does runtime code generation too. In that case though, you would be playing around with code in string literals. Not ideal.

**CodeDOM:** I feel that [CodeDOM](http://msdn.microsoft.com/en-us/library/y2k85ax6(v=vs.110).aspx) is a somewhat under-appreciated part of the .NET framework in that it does not get a lot of buzz (or at least that has been my impression). I am not sure what impact the introduction of [Roslyn](http://msdn.microsoft.com/en-us/vstudio/roslyn.aspx) will have on it, but as of right now I love it the way it is. It is a DOM based approach to working with programmatically constructed code. The entire .NET type system is represented as different node types in the DOM. You can construct a DOM from scratch, or parse existing code into a DOM. Given a DOM, you can generate code in a given language (provided you have the code provider), or compile the DOM on-the-fly into an assembly that you can then load up and use. That is cool in my book any day.

Another cool approach is to combine the two- write classes that use CodeDOM to generate code as a string, and then use that in T4 templates. In any case, I think the choice depends on whether you want your code generated at design time or run-time.

**Design Time:** You would need to do this if there is non-generated code in your application that references constructs from within the generated code. The burden of having to keep generated code around in source control could be somewhat alleviated by having the generation take place as part of the build. In that case, also, however, until you build, the rest of your code is going to have a lot of squiggly red lines. Now, if the rest of your code only referenced interfaces and the implementations were generated, assuming you were using some sort of dependency injection mechanism, that would be a solution. However, that is not the norm with T4 (i.e. generating only on build).

**Run-Time:** With this strategy, you would generate code at run-time (most probably using CodeDOM to generate an in-memory assembly), load that up using [Reflection](http://msdn.microsoft.com/en-us/library/system.reflection(v=vs.110).aspx) or [MEF](http://msdn.microsoft.com/en-us/library/dd460648(v=vs.110).aspx) or what-have-you and then use it. Preferably you would want this to happen at startup or very infrequently for performance reasons. In this case, also, you would need a minimal set of constructs that the rest of your code can reference that provides a bridge to the generated code. An example of this would again be non-generated interfaces with generated implementations.

As I think about it, there are two applications that I have been wanting to use run-time code generation for:

+ Generating WCF proxies when we have a reference to the service/data contracts (although increasingly I have been thinking that might be unnecessary, that's another blog post to come).
+ **[Aspect oriented programming](http://en.wikipedia.org/wiki/Aspect-oriented_programming)**, or more accurately introducing aspects into my implementation code.

Now, aspects as a concept is quite good. To be able to remove cross-cutting stuff from your business logic code is always good. The attribute model in .NET is a very good fit for applying aspects. There are a few issues with what prevails in terms of AOP in .NET though:

+ [PostSharp](http://www.postsharp.net/): They're pretty popular within the AOP crowd, but I don't like my code messed with post-compilation.
+ There are IoC containers that support AOP out of the box, but I don't like to tie myself to any one container just because they support AOP; besides I have been using [MEF for everything]({{< ref "mef-for-everything" >}}).
+ MEF does not have AOP support.
+ If you peruse through NuGet, there are quite a few AOP libraries out there. If you think about it, though, this is a perfect application for run-time code generation. I already have CodeDOM and Reflection in my toolbox. Why not build it in the spirit of [rolling my own]({{< ref "on-rolling-your-own" >}})? I can then build it the way I think makes sense and build it with MEF support in mind.

To that effect, I ended up writing **[Aspects for .NET](http://aashishkoirala.github.io/aspects/)**. It is a library that provides interfaces that you can implement to build your own aspects which you can then apply to your implementation classes. It provides a mechanism to wrap, at runtime, your implementation with aspects. There is also integrated support for MEF, albeit with some limitations.

You can visit the [project page](http://aashishkoirala.github.io/aspects/) or the [GitHub repo](https://github.com/aashishkoirala/aspects) for more detailed documentation, but to summarize, you can "wrap" a class with aspects at run-time. When you do so, it inspects the contract interface and implementation class using reflection. It uses CodeDOM to generate an on-the-fly implementation of the contract interface, which expects an instance of the implementation to be initialized, and where each member simply calls out to the implementation (i.e. a hollow wrapper). However, in the process, it also inspects the implementation member to see if any aspect attributes are applied and adds code at appropriate places before or after the invocation to execute those aspects. The type that is generated on the fly is cached in memory.

As with everything else, there is always room for improvement and feedback is welcome.