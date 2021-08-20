---
title: Two Types of Domain Events
slug: two-types-of-domain-events
date: 2014-09-17
draft: false
tags:
- architecture
- domaindrivendesign
- ddd
---
You can find a good primer on domain events in [this post](http://udidahan.com/2009/06/14/domain-events-salvation/) by Udi Dahan. There are some issues with his approach, though that Jimmy Bogard raises and addresses in [his post](https://lostechies.com/jimmybogard/2014/05/13/a-better-domain-events-pattern/). However, I was left with two questions:

1.  Shouldn't the domain event be dispatched/handled only when the transaction or the unit-of-work commits? Because whatever changes have been made to the state of the domain isn't really permanent until that happens.
2.  There may be cases when domain events need to trigger changes to other domain objects in the same bounded context - and all of that needs to be persisted transactionally. In other words, in this scenario - it makes sense to have the event be dispatched just before the transaction commits. However, in this case, whatever ends up handling that event also needs access to the current transaction or unit-of-work that is in play - so that all the changes make it to persistence in one fell swoop of a commit.

That leads me to conclude that there are really two types of domain events that need to be handled differently. The first type as listed above would either be infrastructure-y things like sending out e-mails and such, or sending messages to other bounded contexts or external systems. The second type would be within the same bounded context but maintain certain kinds of relations within the domain that could not be modeled within the same aggregate (simply put, they take the place of database triggers in the [DDD]({{< ref "getting-on-the-domain-driven-design-bandwagon" >}}) metaphor).

At this point, I have no further design level ideas on how they would be modeled. More on that later, hopefully. I do know that the thing raising the event should not need to know what kind of domain event it is going to raise. If I am a **Foo** and my **Bar** changes, all I care about is I need to raise a **BarChanged** event. I do not need to know what kind of domain event **BarChanged** is. I will let this percolate a bit.