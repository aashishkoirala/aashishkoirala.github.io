---
title: TypeScript, AngularJS and Bootstrap- The Killer Combo
slug: typescript-angularjs-and-bootstrap-the-killer-combo
date: 2013-08-30
draft: false
tags:
- typescript
- javascript
- js
- angular
- bootstrap
---
After having recently used this combination, I am in love with it. For those unfamiliar with any of these, here are quick one liners:

**[TypeScript](http://typescript.codeplex.com/)** is a JavaScript superset from **Microsoft** that compiles down to JavaScript and adds static typing and other neat features like classes and what not. It is worth mentioning that none other than **[Anders Hejlsberg](http://en.wikipedia.org/wiki/Anders_Hejlsberg)** (the father of C#) was involved in its development.

**[AngularJS](http://angularjs.org/)** is a JavaScript framework geared towards building rich and testable single-page applications. This one comes from none other than **Google**.

**[Bootstrap](http://getbootstrap.com/getting-started/)** is a JavaScript/CSS based UI library from **Twitter** that provides you with a foundation to build killer UIs with little effort.

These are all open source and have good community support. It is interesting that a combination of technologies from Microsoft, Twitter and Google would gel so well. If you're building a web application with a JavaScript-heavy frontend (which is what the tide has shifted to these days), I have found AngularJS to be most superior so far. I should qualify that by saying by experience with similar frameworks other than Angular is limited to Backbone and Knockout - but I believe that is a sufficient sample. There are countless comparisons of these frameworks side by side all over the web, so I will not get into details on that. As far as Bootstrap is concerned, the ease with which I can now build amazing professional looking and consistent user interfaces is amazing. I would go so far as to say I would not need a designer to do any of my UI or CSS work. Whatever CSS I know (and everyone should know a little CSS, I guess) proves more than sufficient. If you dabble in LESS, you can even get the LESS version of Bootstrap and go crazy.

I believe [AngularUI](http://angular-ui.github.io/) also has a Bootstrap [extension](http://angular-ui.github.io/bootstrap/), although I have not used that particular library yet. Just vanilla and Angular are proving to be enough for me now, but it is nice to know it's out there should I ever need it. Now, since you'll be writing quite a bit of JavaScript with Angular, it has been my experience that TypeScript makes your job easier by an order of magnitude. No more functions within functions within functions to get the behavior of a class - no more weird bugs due to casting errors that went unnoticed. There is a TypeScript declarations file for Angular available here - just drop it in and you're ready to roll with Angular and TypeScript. Getting that IntelliSense pop up when you type "angular" and hit the dot is a nice feeling.

Two things I miss from Knockout though are how easy it was to subscribe to observables and the notion of computed properties. I know you can do all of this in Angular, but the way you did it in Knockout still seems more intuitive to me. Perhaps I have not fully transitioned to the Angular way of thinking yet. One bone to pick also with TypeScript - it would be nice if there was an object initializer syntax similar to C#. One of the powers of JavaScript is being able to assign an object literal in JSON directly to a variable. That leads to abundant brevity (is that an oxymoron?) which is always good in code. With TypeScript, if your variable is of type `Foo`, you can't just assign an object literal that resembles a `Foo` instance as the compiler has no way of knowing what it exactly is. So you're stuck with having to create a new `Foo`, assign all the properties, and so on. I wish they would introduce object initializers. That would be gravy.

All this aside, if you are contemplating building rich web frontends, I strongly recommend this combination.