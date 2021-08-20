---
title: Running .NET Core Global Tools Without the SDK
slug: running-dotnet-core-global-tools-without-the-sdk
aliases:
- /blog/running-dotnet-core-global-tools-without-the-sdk
date: 2019-09-06
draft: false
tags:
- csharp
- dotnetcore
- docker
- containers
---
[.NET Core Global Tools](https://docs.microsoft.com/en-us/dotnet/core/tools/global-tools) are pretty neat. If you are targetting developers with the .NET Core SDK installed on their machines and need to ship CLI tools, your job is made immensely easier. It is just as easy as shipping a NuGet package. However, once you get used to building these things, it is easy to fall into the trap of treating this shipping mechanism as if it were [Chocolatey](https://chocolatey.org/) (or _apt-get_, or _yum_, or what-have-you). It is certainly not that. The process of installing and upgrading your tools are handled by the .NET Core SDK - which alleviates you from having to create a self-contained package if you were shipping a ready-to-go tool - and this makes sense - global tools are a developer-targetted thing. You're not supposed to use it to distribute end-user applications.

However, there is a use case in the middle that warrants some resolution, and that is - being able to install and run a .NET Core Global Tool on a machine that has the .NET Core Runtime installed but not the SDK. A good example of this is if, as part of my deployment pipeline, I need to build a **Docker Container** image that is supposed to run in production and therefore has the Runtime installed but not the SDK - and it needs this tool installed in the container.

In this scenario, the following is what I do:
- As part of the deployment pipeline, install the tool on the deployment machine itself (or hosted agent or whatever if you're using a CI/CD pipeline tool)- which is going to have the SDK since you're building and deploying stuff from it.
- As part of installing the tool, the SDK will then create a folder where the tool is published so as to be self-contained (not TOTALLY self-contained, it will still need the Runtime, of course).
- As part of your Docker image build, add a *COPY* line to your *DOCKERFILE* to copy the tool files to your container image.

**Example**

Let's say I have a global tool called **mytool** that is published to NuGet with version **1.0.0**. Then, If I run the following:

	dotnet tool install -g mytool

The tool ends up getting installed in the _UserProfile_**/.dotnet/tools/** directory (where _UserProfile_ would commonly be **/Users/**_username_ in Windows and **/home/**_username_ in Linux). You can further control the install path using the `--tool-path` option rather than the `-g` (or `--global`) option - if that makes your job easier.

In the above mentioned folder, it creates a platform-native executable shim with the actual files residing inside a **.store** directory. So, going back to the **mytool** example, you could have the directory structure as follows:

	UserProfile/.dotnet/tools/.store/mytool/1.0.0/pfxtool/1.0.0/tools/netcoreapp2.2/any

The above is just an example. The actual structure will be similar but could vary depending on what TFMs the tool targets and how the NUPKG is packaged and is thus exploded by the installer. In any case, inside this directory will be the set of files that make up this tool along with the main startup assembly (say **mytool.dll**) that you can invoke by switching to this directory and running:

	dotnet mytool.dll

You can use this mechanism to then set up your *DOCKERFILE* to copy the files to a well-defined location inside the container. Perhaps you can add the well-defined location to *PATH* or add a shim shell script to invoke it to make things easier. It's all a bit cumbersome but it works. Of course, if you OWN the tool, you could just publish it differently with `dotnet publish` - but in cases where you need to use a published tool in your production runtime environment, this helps.