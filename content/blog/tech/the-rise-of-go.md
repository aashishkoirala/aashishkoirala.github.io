---
title: The Rise of Go
slug: the-rise-of-go
aliases:
- /blog/the-rise-of-go
date: 2020-01-20
draft: false
tags:
- go
- golang
- kubernetes
- docker
- microservices
- hashicorp
---
Recently, [Go](https://golang.org/) has seen a real uptick in popularity and adoption for a variety of different usages. It has been around for a while and has been continually improving. The purpose-built simplicity and extra focus on making concurrency easy and safe is part of it. The other part I like is the ease with which what you write becomes portable. These aspects especially make it a good fit to write infrastructure and tooling.

I think the recent spike in popularity can be attributed to two factors- the first being Docker/Kubernetes/CNCF and the second being HashiCorp.

[Docker](https://www.docker.com/) was written in Go, which I assume had some influence in [Kubernetes](https://kubernetes.io/) being written in Go (or maybe it was because it incubated in Google). In any case, what that has meant is a good chunk of the tooling that has been built around Kubernetes has been written in Go. By extension, [CNCF](https://www.cncf.io/), which was borne out of Kubernetes, has been incubating a large number of projects, most of which are written in Go. It is almost like an unwritten rule that a CNCF project better be written in Go (sort of like Apache with Java). Some of the more widely used tools like [Helm](https://helm.sh/) and [Jaeger](https://www.jaegertracing.io/) are good examples.

[HashiCorp](https://www.hashicorp.com/) is a big player in the distributed software and cloud tooling space, and its adoption of Go is probably a factor as well in its popularity. Most of its major products like [Terraform](https://www.hashicorp.com/products/terraform), [Vault](https://www.hashicorp.com/products/vault), [Consul](https://www.hashicorp.com/products/consul), [Nomad](https://www.hashicorp.com/products/nomad) and [Packer](https://www.hashicorp.com/products/packer) are all written in Go.

I have been dabbling in Go recently, and I like it. If I had to write something quickly or something big with lots of moving pieces, I would still fall back on my comfortable cushion that is C#. For a lot of usages, that is still the right language to use (or whatever your mainstream language of choice is- be it Node, Python or Ruby, and if you're a Java person, well, you do you). I have been trying to force myself to adopt Go at least for any CLI tooling that needs to be written. By extension, I have started to like seeing CLI tooling written in Go rather than once written in Python or Node, I think mainly because of the portability. All Go-built tools are shipped as single executables, which just makes everything so much better.

For infrastructure components, Go strikes a good balance between performance and maintainability. I think a good tag-team combination is Rust for the really low-level stuff combined with Go as an orchestrator.

But even in the domain of writing application services, where my primary choice is C#, I think Go is seeing a lot of popularity, especially because of the rise of microservices and each piece not having to be built up of a very large number of components.

If you are in a position where you would like to broaden your programming language horizon, I would certainly give Go a shot.