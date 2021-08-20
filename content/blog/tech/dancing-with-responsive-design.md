---
title: Dancing with Responsive Design
slug: dancing-with-responsive-design
date: 2013-12-05
draft: false
tags:
- css
- javascript
- js
- bootstrap
---
I have been hearing about [responsive design](http://en.wikipedia.org/wiki/Responsive_web_design) on and off for some time now, and it has always appealed to me as a pattern to follow for web-based user interfaces. CSS3 is obviously quite powerful and media queries provide a relatively easy way to build one unified UI that looks great on PCs, but then adapts and shape-shifts accordingly when viewed on a smartphone or tablet without having to completely re-implement a "mobile site" as so many do today. Since UI design is not my core area, though, I never could quite gather the energy to do something with it. Then I saw support for responsiveness in the new [Bootstrap 3](http://getbootstrap.com/css/#responsive-utilities). Like with all other aspects of web UI design, it makes responsiveness that much easier as well. As added motivation, I tried out my [To Do]({{< ref "yes-one-more-to-do-application" >}}) application in my smartphone - and it looked awful.

In the spirit of [rolling my own]({{< ref "on-rolling-your-own" >}}), my next application I wanted to build for myself was a simple list maker that I could use for groceries, shopping, and other checklists. Since something like that would find its best use across multiple types of devices (and since I am not quite ready to jump into native mobile development just yet), it seemed like the perfect opportunity to try out responsive design with Bootstrap. After getting over a slight upgrade shock after switching from Bootstrap 2.3 to 3 (helped quite a bit by [this post here](http://www.sitepoint.com/whats-new-bootstrap-3/)), things became quite easy.

The end result is my new application, so very imaginatively titled **My Lists**- deployed [here](http://mylists.apphb.com) (again, be aware that this is a development instance), and open sourced [here](http://github.com/aashishkoirala/mylists/). Here is a screenshot of what it looks like in PCs and in tablets in landscape:

![Screenshot](http://mylists.apphb.com/Content/images/screenshot-big.png)

Here is a screenshot of what it looks like in a smartphone:

![Screenshot](http://mylists.apphb.com/Content/images/screenshot-small.png)


Rest of the technology is pretty much the same as [To Do]({{< ref "yes-one-more-to-do-application" >}})- .NET REST API, AngularJS and MongoDB.

Responsive design takes a little getting used to, but I think is quite worth it.