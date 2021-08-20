---
title: Diagnosing MEF Composition Errors
slug: diagnosing-mef-composition-errors
date: 2014-10-15
draft: false
tags:
- mef
- csharp
- dotnet
---
For all its goodness, if something goes wrong, problems with [MEF]({{< ref "mef-for-everything" >}}) are terribly hard to diagnose. Thankfully, there's an [article](https://blogs.msdn.microsoft.com/dsplaisted/2010/07/13/how-to-debug-and-diagnose-mef-failures/) out there by [Daniel Plaisted](https://social.msdn.microsoft.com/profile/dsplaisted) at Microsoft that goes into great detail into all the things that can go wrong with MEF and how to get to the bottom of each one. I have it bookmarked, and if you work a lot with MEF, you should too. The one area that I find most useful, though, is figuring out composition-time errors using tracing.

With MEF, if you are using the _Import_ attribute and there are errors during composition - either due to a bad _Export_, a missing DLL, or even an exception in the constructor, the composition itself will not choke. It will simply not load the Export and therefore anything that depends on it into the container. The problem then manifests itself as a missing Export when you try to use it. By then, it's too late to know what happened.

An easy diagnosis tool from the [article I mentioned above](https://blogs.msdn.microsoft.com/dsplaisted/2010/07/13/how-to-debug-and-diagnose-mef-failures/) is to drop the following snippet into your application configuration file (_App.config_, _Web.config_, what-have-you).

	<system.diagnostics>
	  <sources>
		<source name="System.ComponentModel.Composition" switchValue="All">
		  <listeners>
			 <add name="fileListener" type="System.Diagnostics.TextWriterTraceListener" initializeData="composition.log" />
		  </listeners>
		</source>
	  </sources>
	  <trace autoflush="true" indentsize="4" />
	</system.diagnostics>

After the composition routine runs, check the file configured above (in this example, "_composition.log_") for any errors. You will have to sift through a lot of "everything's okay" type messages, but errors stand out fairly easily. If something is causing the composition to skip certain parts, it will tell you exactly what and why - so you can fix it and move on rather than scratch your head and wonder what's wrong. Make sure you disable it after you're done though - the trace is pretty verbose and if you leave it on, that file will grow extremely large before you know it.