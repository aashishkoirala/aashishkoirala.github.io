---
title: Getting Functional With Perhaps
slug: getting-functional-with-perhaps
date: 2014-03-04
draft: false
tags:
- csharp
- dotnet
- functional
---
Ever since the introduction of LINQ, people have been trying all sorts of clever ways to get more functional constructs into C# to wrap away certain annoying procedural details that are part of the language because of its non-functional beginnings. One of the most annoying class of operations in this context are the *TryX* methods (e.g. `TryGetValue`, `TryParse` and so on) that use `out` parameters and force you to break into statements what is otherwise a fluent sequence of calls.

Then there are others, even within LINQ, such as `FirstOrDefault` that keeps you from choking like `First` does - but then can't tell the difference between something not being there versus something being there but being null (or the type-default for value types).

I recently stumbled across two instances of the clever things people do, viz. [Brad Wilson's **Maybe&lt;T&gt;**](https://gist.github.com/bradwilson/9200743) and [JaredPar's **Option&lt;T&gt;**](http://blogs.msdn.com/b/jaredpar/archive/2008/10/08/functional-c-providing-an-option-part-2.aspx). This inspired me to add some more goodness in and cook up something of my own, aptly named **Perhaps&lt;T&gt;**. I am making it part of the [Commons Library]({{< ref "the-commons-library" >}}), and you can find the source code here:

+ **[Source code for Perhaps&lt;T&gt;](https://github.com/aashishkoirala/commons/blob/develop/src/AK.Commons/Perhaps.cs)**

Here are a few examples of how this might be used:

	// Example 1: Dictionaries.
	 
	 
	// Using "string" as key/value for example; could be anything.
	IDictionary<string, string> myDictionary;
	// ...
	// ...
	 
	// Returns Perhaps<string>.NotThere if not found.
	var dictionaryResult = myDictionary.LookFor("MyKey"); 
	 
	if (dictionaryResult.IsThere)
	{
	    // Throws if called on "NotThere".
	    var string1 = dictionaryResult.Value;
	    
	    var string2 = dictionaryResult.ValueOrDefault;
	    
	    // Automatically casts to underlying type.
	    var string3 = dictionaryResult + " and so on and so forth.";
	 
	    // Other stuff to do if the value is there.
	}
	 
	// Look for stuff and operate on it in one sequence of calls.
	myDictionary.LookFor("MyKey").DoIfThere(value => /* Do stuff with value */);
	 
	// Look for stuff and get otehr stuff based on it in one sequence of calls.
	var finalValue = myDictionary
	    .LookFor("MyKey")
	    .DoIfThere(value => /* Return stuff based on value */, "Default value");
	 
	 
	// Example 2: Parsing text.
	 
	string text;
	// ...
	 
	text.ParseInteger().DoIfThere(value => /* Do stuff with value */);
	text.ParseDateTime().DoIfThere(value => /* Do stuff with value */);
	// and so on and so forth for long, float, double, decimal, bool
	 
	// Example 3: Stuff that throws ("int" used as type for example, could be anything).
	 
	var result = Perhaps<int>.Try(() => /* Stuff that may throw an exception. */);
	if (!result.HasError)
	{
	    // Do stuff here. Now, this may seem weird, but this makes more sense when you think of
	    // getting a list of results and filtering out errored ones and then operating further on
	    // valid ones, etc.
	}
	 
	 
	// Example 4: LINQ stuff ("string" used as type for example, could be anything).
	 
	IEnumerable<string> list;
	// ...
	 
	var first = list.PerhapsFirst(x => x.ParseInteger().IsThere); // Aaha!
	var single = list.PerhapsSingle().DoIfThere(x => /* Do stuff with value */);
	var last = list.PerhapsLast(x => x.StartsWith("ABC"));

It's mostly obvious stuff, but I think this will go a long way in making my code less noisy.