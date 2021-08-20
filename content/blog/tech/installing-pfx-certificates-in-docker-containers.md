---
title: Installing PFX Certificates in Docker Containers
slug: installing-pfx-certificates-in-docker-containers
aliases:
- /blog/installing-pfx-certificates-in-docker-containers
date: 2019-09-09
draft: false
tags:
- docker
- containers
- kubernetes
- microservices
- pfx
- certificates
- pkcs12
---
Recently, I came across having to install PKCS12 certificate bundles (i.e. a PFX file with the certificate and private key included, protected with a password) on a **Docker** container. This is standard fare on normal Windows machines or on PaaS systems such as Azure App Service. Doing this on a container, though, proved to be tricky (perhaps with good reason as I mention later) - so tricky that I ended up writing [my own tool](https://pfxtool.aashishkoirala.com) to do it. I have written this up in case you have similar needs and are working with **.NET Core**.

**Should you?**

Probably not- if you can help it. The most common reason to install a PFX with private key anywhere is so that some application running there can access it and use it for authentication, signing or other cryptography purposes. Usually, this is on a protected production machine or somewhere more _managed_ where the security is managed by the resource provider (e.g. Azure App Service). By that rationale, if your container image is going to be stored somewhere secure, I guess it's fine. If your image is published or is going to run some place where anyone can get to it - then that's almost as bad as just handing out your private key. This is because with the image in hand, anyone can fire up Docker, get inside the image, and extract it or use it.

Most platforms will allow you to parameterize sensitive information and pass it securely to Docker while running the container. If I have to deploy my application to **Kubernetes**, for example, I can generate a [Kubernetes Secret](https://kubernetes.io/docs/concepts/configuration/secret/) out of it. That also means, though, that I have to change my application to be able to read this information as if though it were in a file. Now, if I have that option, it is the best one to go with.

**Okay, but I still need to**

I found very sparse documentation online related to installing PFX on containers. As far as Windows (i.e. NanoServer) is concerned, **certoc.exe** is the prescribed tool to deal with certificates. I can't use **PowerShell** and the good old `Import-PfxCertificate` because the .NET Core SDK/Runtime images don't have PowerShell since PowerShell has a dependency on .NET Framework. They have **PowerShell Core** but that does not have the certificate commands yet. But most online content surrounding certoc deals with installing CA public key certificates to the root store, and not with PFX certificates. Getting your hands on the tool is also bit of a chore. It's included on the NanoServer base image, but not on the .NET Core Runtime or SDK base images. So I have to create a multistage DOCKERFILE to get it from one, copy it to the other to run it, and so on. After all that, even though there are options for it, I just couldn't get PFX to work with certoc - and the error messages are unhelpful to say the least. As an added deterrent, it's a Windows-only thing - so would not work on Linux containers anyway.

**So just write your own**

If you're already trying to run a .NET Core application on a container and are in the space of writing .NET Core code, your best bet therefore is to just use the `X509Store` API to write a quick little tool that will do what you want. Installing a PFX is as easy as (this is the simplest case i.e. single certificate, no chain):

	using (var certificate = new X509Certificate2(pfxFileBytes, pfxPassword, X509KeyStorageFlags.Exportable | X509KeyStorageFlags.PersistKeySet))
    using (var store = new X509Store(storeName, storeLocation, OpenFlags.ReadWrite))
	{
        store.Add(certificate);
        store.Close();
	}

**To that end - PFXTOOL**

I ended up writing a [.NET Core Global Tool](https://docs.microsoft.com/en-us/dotnet/core/tools/global-tools) that does the above and a bunch more with PFX certificates so that I could use it more easily in containers. [You can find PFXTool here](https://pfxtool.aashishkoirala.com/). I've tested it on .NET Core Runtime Docker images with both Windows NanoServer and Alpine Linux. The following are sample DOCKERFILEs that I used to test it (I've included the simpler ones that run on the SDK base images. The Runtime ones are a bit trickier since you need the SDK to install .NET Core Global Tools - [I've documented the workaround here]({{< ref "running-dotnet-core-global-tools-without-the-sdk" >}}) - and that is what I did for this tool as well).

_Windows_

    FROM mcr.microsoft.com/dotnet/core/sdk:2.2-nanoserver-1803
    WORKDIR /app
    COPY TestCertificate.pfx ./
    RUN dotnet tool install pfxtool -g && pfxtool import --file TestCertificate.pfx --password Password123 --scope user
    ENTRYPOINT ["pfxtool", "list", "--scope", "user"]

_Linux_

    FROM mcr.microsoft.com/dotnet/core/sdk:2.2-alpine3.9
    WORKDIR /app
    COPY TestCertificate.pfx ./
    ENV PATH "$PATH:/root/.dotnet/tools"
    RUN dotnet tool install pfxtool -g && pfxtool import --file TestCertificate.pfx --password Password123 --scope user
    ENTRYPOINT ["pfxtool", "list", "--scope", "user"]

**A quick note about `X509Store` on Linux**

On Windows, it is pretty clear where `X509Store` puts the certificates since they're accessible using _certmgr_. On Linux, though, the whole thing is a bit of a retrofit of the contracts on to how Linux (or **OpenSSL** to be precise) handles certificates. While it generally works and will most probably work for your scenario, you should note the following:

- The only supported stores for _LocalMachine_ are _Root_ and _CA_ (_Root_ points to the OpenSSL certificate directory, and _CA_ I think is a filter on _Root_ that excludes self-issued certificates).
- OpenSSL does not have the concept of a _CurrentUser_ scope. Anything you put in or get from _CurrentUser_ stores go to a special .NET-specific directory (`~/.dotnet/corefx/x509stores/` - officially undocumented and subject to change).

And there you have it. I guess you could summarize it as: try not to do it, here's how you should probably handle it instead, but if you have to, here's a way, here's even a tool, but then look at these caveats if you're on Linux.