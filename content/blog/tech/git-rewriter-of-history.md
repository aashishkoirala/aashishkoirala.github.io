---
title: Git- Rewriter of History
slug: git-rewriter-of-history
aliases:
- /blog/git-rewriter-of-history
date: 2015-01-07
draft: false
tags:
- git
- rebase
---
Undoubtedly one of the biggest advantages that [Git](https://git-scm.com/) provides is using [rebasing](https://git-scm.com/docs/git-rebase) to maintain a clean commit history. I find that I am using it a lot these days- primarily in three modes:

* As part of _pull_ (i.e. **git pull -rebase**)
* Interactive rebase to: 1) keep my own history clean when I am off working on a branch by myself, and 2) clean up a feature branch's commit history before merging it into the mainstream
* Rebase my branch against a more mainstream branch before I merge onto it (i.e. **git rebase** _mainstream-branch_)

With interactive rebase, usually what I do is- I will have one initial commit that describes in general the feature I am working on. It will then be followed by a whole bunch of commits that are advancements of or adjustments to that - quick and dirty ones with "WIP (i.e. work in progress) as the message. If, in the middle of this, I switch to some other significant area, then I will add another commit with a more verbose message, and then again it's "WIP, "WIP, and so on. I will add any thing I need to qualify the "WIP with if necessary (e.g. if the "WIP is for a different context than the last few WIPs, or if the WIP does indeed add some more information to the initial commit). In any case, after some time, I will end up with a history that looks a bit like this (in chronological order):

	hash0 Last "proper" commit.
	hash1 Started implementing feature 1. Blaah blaah.
	hash2 WIP
	hash3 WIP
	hash4 WIP
	hash5 Started implementing feature 2. Blaah blaah.
	hash6 WIP
	hash7 WIP
	hash8 WIP (feature 1)
	hash9 WIP (feature 1)
	hash10 WIP (feature 2)

At this point, I will realize that things are getting a bit unwieldy. So I do an interactive rebase, i.e. **git rebase -i** _hash0_, which gives me this:

	p hash1 Started implementing feature 1. Blaah blaah.
	p hash2 WIP
	p hash3 WIP
	p hash4 WIP
	p hash5 Started implementing feature 2. Blaah blaah.
	p hash6 WIP
	p hash7 WIP
	p hash8 WIP (feature 1)
	p hash9 WIP (feature 1)
	p hash10 WIP (feature 2)

The first thing I will do is reorder the commits so that they are not interleaving back and forth between what they logically represent (i.e. features 1 and 2 in this case). This, of course, assumes, that there is no overlap in terms of code units touched by features 1 and 2.

	p hash1 Started implementing feature 1. Blaah blaah.
	p hash2 WIP
	p hash3 WIP
	p hash4 WIP
	p hash8 WIP (feature 1)
	p hash9 WIP (feature 1)
	p hash5 Started implementing feature 2. Blaah blaah.
	p hash6 WIP
	p hash7 WIP
	p hash10 WIP (feature 2)

Next, I mark the main commits as "r for _reword_ if I need to improve the commit message, or as "e for _edit_ if I also need to, for some reason, change the commit date (I will usually do this using **git commit --amend --date=now** so that the history looks nice and chronological). The "WIP commits- I mark as "f for _fixup_- which is a version of _squash_ that skips the step that lets you combine the commit messages, since "WIP does not have anything worth combining in terms of the commit message.

	e hash1 Started implementing feature 1. Blaah blaah.
	f hash2 WIP
	f hash3 WIP
	f hash4 WIP
	f hash8 WIP (feature 1)
	f hash9 WIP (feature 1)
	e hash5 Started implementing feature 2. Blaah blaah.
	f hash6 WIP
	f hash7 WIP
	f hash10 WIP (feature 2)

When all is said and done and the rebase is complete, I have a nice clean history:

	hash0 Last "proper" commit.
	hash11 Implemented feature 1.
	hash12 Implemented feature 2.

I love Git.