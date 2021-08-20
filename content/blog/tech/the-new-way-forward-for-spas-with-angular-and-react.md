---
title: The New Way Forward for SPAs with Angular and React
slug: the-new-way-forward-for-spas-with-angular-and-react
aliases:
- /blog/the-new-way-forward-for-spas-with-angular-and-react
date: 2016-12-01
draft: false
tags:
- spa
- js
- javascript
- angular
- react
---
Having worked with *Angular 1.x* for some time and having liked it quite a lot (I guess that one we're supposed to call **AngularJS**, and the new one is just **Angular** - yes, that is not confusing at all, is it?), I must say I was quite spooked when I first saw the documentation for the new [Angular](https://angular.io/). It indeed is a completely different framework. There is no easy migration path from AngularJS short of a rewrite, at which point you might as well evaluate all your options including React.

Having evaluated both the new Angular as well as React, I noticed a few things. First, looks like I will have to [eat my words regarding TypeScript]({{< ref "bye-bye-typescript-for-now" >}}), as that is now the de-facto dialect of choice for Angular. With [React](https://reactjs.org/), it seems to be ES6, which at this point, I still prefer over TypeScript (even though TS has more features, a gap that I hope will be bridged with ES7).

Second, the tooling around JS coding is crazy complex now! You can't just throw together a bunch of ES5 scripts into your server-side project, whatever platform it may be in, and call it a day. JS has evolved so much with ES6/TypeScript, there is build and deployment tooling around it - all based on Node - there is package management with NPM and the like - it is a full blown programming ecosystem. What this means is that if you've been late to the game adopting JS tooling because you could get away with slapping ES5 scripts together, with these new frameworks or libraries, you will not have that choice anymore, so you'd better get on-board.

Third, and perhaps most interesting, is that as different as they appear, they are similar in spirit. Both the new Angular and React are **component-based** - and that, it turns out, is a good way to be as far as frontend development is concerned. Looking at both Angular and React from the AngularJS lens, and ignoring the internals and the performance and runtime implications, you could draw a comparison to directives. I remember thinking when working with AngularJS - why all this asymmetry? Why isn't everything simply a directive? Well, looks like quite a few people agreed.

In any case, if you're going to build a SPA today, you are going to have to weigh quite a few options and your decision-making process has become more difficult. You are probably going to see something better come along in a few months once you've adopted something - and while it can be frustrating, these are exciting times to be doing JS on the frontend.
