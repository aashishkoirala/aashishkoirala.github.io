---
title: On Rolling Your Own
slug: on-rolling-your-own
date: 2013-12-03
draft: false
tags:
- csharp
- dotnet
- architecture
---
Within the context of software development, the phrase "rolling your own" usually has a bad smell attached to it. Most of the time, this is with good reason. If you are building a fairly complex system for a business and there is ROI at stake, it surely makes sense to at least assess what is readily available in the industry and is used and thus "certified" by the community for certain components before jumping in and building it oneself (however fun that may be). On the extreme end of this, you certainly don't want to roll your own operating system or database (unless that is at the core of what you're doing - in which case, of course, you do).

There are certain situations, however, where it makes sense to roll your own or at least try to roll your own - even if you end up throwing it away. The one obvious situation is when you want to learn a new technology, a new framework, a new pattern, etc. When it comes to learning something new, nothing beats actually trying to build something tangible using it. Sometimes, even when I'm embarking on rolling something of my own knowing in advance that this is a fool's errand, I end up gaining new insights into what actually goes into building something like that. That helps me gauge how readily available components might be doing what they are doing. The other situation, I believe, deserves more emphasis - and that is when you need something for personal use.

You need a "something that does something". There are options out there, some are good but you don't want to pay for them; others are free and are mostly okay, but don't quite fit your personal use case a hundred percent. You are a developer, you have the skills, and you have a chance right there to exercise that skill. If you had the time or if you could make the time, why wouldn't you just build it? In addition, if building it involved some new technology that you could learn in the process, would you not itch to build it? If software is just a job for you, then that option is probably not as attractive to you. But if it also happens to be your passion and/or hobby as it is mine, I would think you would love to do it just for yourself; and in the end, if what you have built is good enough that other people benefit from using it, and then hey- you have an actual product on your hands.

This is the philosophy that led me to build the [Commons Library]({{< ref "the-commons-library" >}}), [Finance Manager]({{< ref "finance-manager" >}}) and [To Do]({{< ref "yes-one-more-to-do-application" >}}) - and a bunch of other projects that are on my personal queue. I have been using and intend to use all of these things I made. Do they work for me? Yes. Will they work for everyone? No. Will they make me rich? No. Did I enjoy making them? Yes. Did I learn something new while making them? Yes. Are the last two reasons enough for me to have worked on them? Absolutely.
