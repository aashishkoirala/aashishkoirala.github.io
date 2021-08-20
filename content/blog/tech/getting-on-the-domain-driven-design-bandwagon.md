---
title: Getting on the Domain-Driven Design Bandwagon
slug: getting-on-the-domain-driven-design-bandwagon
aliases:
- /blog/getting-on-the-domain-driven-design-bandwagon
date: 2014-06-16
draft: false
tags:
- architecture
- ddd
- domaindrivendesign
---
[Domain driven design](https://en.wikipedia.org/wiki/Domain-driven_design) has been around for quite a while. I believe the [definitive book](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215) on it by **Eric Evans** came out first in 2004. For whatever reason, I had not been exposed to it in places I worked. I had been hearing about it for enough time and from enough smart people to give it a try. I researched it online a bit and went through quite a few articles. Especially, the set of articles on DDD by [Jimmy Bogard](https://lostechies.com/jimmybogard/) (Los Techies) was quite helpful. Finally, I ended up buying Evans' book and reading it cover to cover.

I liked what I saw. The whole idea behind keeping your domain logic encapsulated within your domain objects appealed to me. There were questions, obviously, but I figured it was worth trying out. So that is what I am deep into currently. The idea of entities, value objects, aggregates and aggregate roots makes sense, but at the same time, also raises questions - especially with regards to database performance. I am hoping I will arrive at satisfactory answers.

As things get more complex, other concepts such as bounded contexts and domain events enter the picture. While I get them in theory, my idea for now is to stay away from actually getting hands-on with those until I have a good handle on "vanilla" DDD. Another question I have is how this meshes with [SOA](https://en.wikipedia.org/wiki/Service-oriented_architecture) - whether the two are complimentary or exclusive. I would hate to have to give up SOA to stick with DDD. In any case, it feels exciting - and I can't believe it has been around for so many years and I never got into it.

For anyone getting into DDD, I strongly recommend reading Evans' book. In software timescale, it was written aeons ago (when Java was the state-of-the-art, mind you). But all of it still applies, and if you're working with something like C#, as I am, things become even easier since you have so much more power with these modern languages.

So, for the moment, let's say I am on the bandwagon. Hopefully I don't have to get off.