---
title: Modeling, DSL and T4- Ramblings
slug: modeling-dsl-and-t4-ramblings
aliases:
- /blog/modeling-dsl-and-t4-ramblings
date: 2013-09-03
draft: false
tags:
- dsl
- t4
- architecture
- modeling
- dotnet
---
> **UPDATE (2015/01/10)**

> There have been changes in my thoughts about how one should go about this. Consequently, I have abandoned the modeling library that I speak of in this blog post. Understandably, the link to which that points no longer works.

I absolutely loathe writing repetitive code. That is what machines are for. My philosophy therefore is to try to generate as much of these kinds of code as possible. With .NET, [T4](http://en.wikipedia.org/wiki/Text_Template_Transformation_Toolkit) gives you a pretty neat code generation mechanism for generating code that follows a given pattern (the first example that comes to mind are POCOs from a domain model). If you think about it though, most multi-tier enterprise type applications have quite a bit of code that can be generated and that derives from the original domain model. How nice would it be to be able to generate a huge chunk of the codebase so that you only have to think about, write and *test* what you absolutely need to? I guess Entity Framework does some of it for you if you're into it. If you don't like the heavy-handedness of it (like me), you could opt for keeping your model as an EDMX file but then writing a bunch of T4 around it to generate various layers of code based on it.

What I think is really neat is to be able to have a domain specific language (DSL) that is capable of describing your model with all of its unique requirements and nuances that EDMX does not give you. You could then have something based on T4 around that model - all packaged into one neat library/add-in that you would use for development. A basic workflow would then involve creating the model, generating the code, and then filling in the blanks where actual logic is required.

That is the ultimate goal, anyway. That is my plan for [this modeling library](http://aashishkoirala.github.io/modeling/). For now, though, my DSL is a rudimentary JSON description of my entities, and all I have in there is a [T4 based library](https://www.nuget.org/packages/AK.Modeling.TextTemplating/) that generates entities and repositories based on those JSON descriptions. But even having built this much of it has made my job so much easier when I am building applications. If you haven't dabbled with T4, I would strongly recommend it. As far as a full-blown modeling kit is concerned, I believe [this](http://msdn.microsoft.com/en-us/library/bb126259.aspx) is what the big boys play with. I'm not there yet, but I plan to get into it fairly soon, situations permitting.