---
title: Using CSS Media Queries for Responsive UI Design
slug: using-css-media-queries-for-responsive-ui-design
aliases:
- /blog/using-css-media-queries-for-responsive-ui-design
date: 2014-11-11
draft: false
tags:
- css
- responsive
- bootstrap
---
Using something like [Bootstrap](http://getbootstrap.com/) for a [responsive UI]({{< ref "dancing-with-responsive-design" >}}) covers most of the bases. But if you need more control, it's a good idea to get familiar with [Media Queries](http://www.w3schools.com/css/css_rwd_mediaqueries.asp) in CSS. It might come in handy some time, plus that is what Bootstrap uses under the hood as well, and it never hurts to learn how the tools you use work. The [Mozilla page](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries) on media queries goes into just the right amount of detail and gives you a good outline of everything you can do with it.

To be very brief though, here is how you use a media query in CSS:

> **@media** _query_ **{** _normal-css_ **}**

This scopes it so that the CSS within the query (i.e. _normal-css_ above) is applied only when the condition dictated by _query_ is true. So, you could use it to say apply this style when the width or height or in a given range, or if we're using a given type of device, or color setting, and so on.

The following, for example, sets the background color of the body to red only when the view area width is 300 pixels or more (stupid usage scenario, I know, but you get the point as to how this could be used to make your UI responsive in all sorts of ways):

	@media (min-width: 300px) { 
	   body {
		 background-color: red;
	   }
	}

A powerful tool to have in your chest when building user interfaces.