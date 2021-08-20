---
title: Bye, Bye, TypeScript, for now
slug: bye-bye-typescript-for-now
aliases:
- /blog/bye-bye-typescript-for-now
date: 2014-04-15
draft: false
tags:
- js
- javascript
- typescript
---
As much as I raved about TypeScript in [this post]({{< ref "typescript-angularjs-and-bootstrap-the-killer-combo" >}}) from some time ago, sadly the time has come for me to part with it - at least for now. It is a beautiful piece of work by a beyond-brilliant group of people. As I worked more and more with JavaScript the past year, though, I realized a few things.

The first, and this I already mentioned in my previous post, is that it is still maturing and is not quite there yet. One of my pain points was the lack of object initializers that, in my opinion, took away some of the expressiveness of JavaScript. However, as I now look at it, it is the whole idea of trying to hide the fact that everything in JavaScript is a hash-map. Thus, you can and should be able to create an object or assign an object on the fly using JSON notation. As soon as you introduce TypeScript annotations into the mix, this goes away. The best of both worlds here would be if I could have it annotated and still be able to assign or initialize using JSON (and have the JSON be validated based on the annotation).

The other side to that equation is just the ability to pass tuples around like primitive variables. That is what you get with JSON objects - and while it looks unstructured when looked at from the lens of a more strict language, it is in fact a feature by design. Similar reasoning can be applied to the whole idea of what functions are in JavaScript, how they can define scope, how they can nest, and so on. I am not sure how much having the syntactic sugar of modules and classes helps in that regard.

Of course, TypeScript is a superset - so you can choose to use TypeScript where you wish and have vanilla JS in other places - but then you end up with this asymmetrical mess that still needs to go through the TypeScript compiler before it can work. I do not like asymmetry.

The second reason is something I find hard to articulate, but have experienced nonetheless. I think TypeScript gels fine with Angular, but as soon as you start to use certain prominent frameworks like RequireJS or Jasmine, it starts to get in the way somewhat. Regardless, though, having to go look for "d.ts" files every time you want to use a library is a pain.

The third reason is more of an invalidation of one of the merits of TypeScript as I initially saw - and that was tooling support. At first glance I was quite impressed by the IntelliSense and what not TypeScript brought to my humble Visual Studio JavaScript editor. However, the tooling since then has gotten a lot better in major IDEs just for vanilla JavaScript - up to a point I feel that it is not worth putting up with the overhead of having an add-on running.

Of course, even as I write this, my opinions are based on an early version that I have been using. I know it is progressing rapidly, so it may become a viable option at one point. Since ES6 is moving in a direction similar to TypeScript, however, I believe most libraries will adapt to the new specifications from ECMA - thus rendering TypeScript unnecessary. In any case, at least for now, I have decided to bid farewell to TypeScript.