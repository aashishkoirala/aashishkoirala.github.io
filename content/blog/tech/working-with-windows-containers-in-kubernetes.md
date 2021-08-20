---
title: Working with Windows Containers in Kubernetes
slug: working-with-windows-containers-in-kubernetes
aliases:
- /blog/working-with-windows-containers-in-kubernetes
date: 2019-09-12
draft: false
tags:
- kubernetes
- dotnetcore
- docker
- containers
- microservices
- azure
- aks
---
Even though **Docker** was built atop Linux containers and that is the majority of Docker usage out there, [Windows Containers](https://docs.microsoft.com/en-us/virtualization/windowscontainers/about/) have been a thing for a while now. They went mainstream in 2016, and one hopes "ready for primetime" with Windows Server 2019. Even though integration with Docker is getting tighter, if you are in the unfortunate position of having to use Windows Containers with **Kubernetes**, you are going to have issues.

If your language/runtime is platform-independent, and if you're not invoking any platform-specific libraries, your best bet would be to just stick to Linux containers. For .NET folks, this means using .NET Core and making sure you're not using anything that is Windows-native (or if you are, making sure there is a fallback or abstraction or what-have-you). Additionally, you should make sure your code is not making any assumptions about what platform it is running on (think file path roots and separators). Staying with Linux containers means - if nothing else - that your Kubernetes deployment is part of the majority - and you are more likely to find resources or support online for issues that may arise.

If you do decide to embark on your Windows Container-Kubernetes journey, keep the following in mind:

- There is no good "Developer Machine Testing" option. **Docker for Windows** supports Windows containers but the instance of Kubernetes that ships with it doesn't. **Minikube** does not support Windows containers.
- This means you have to set up a deployable environment and use that instead of testing locally on your own machine. So the best you can do is maybe test your container directly on Docker on your machine, and then deploy it out to your test cluster and see if it works.
- As far as a deployable environment is concerned, short of setting up an on-prem cluster on Windows Server 2019 boxes (that only covers the worker nodes - the control plane still needs Linux), your best bet is to go with one of the big three cloud providers.
- All three- [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-us/services/kubernetes-service/), [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine/) and [Amazon EKS](https://aws.amazon.com/eks/) - claim support for Windows Containers in some capacity, however all of them are in Preview mode currently and thus not ready for production use.
- This being Windows Containers, I would say safest bet might be to go with AKS. That is the only one I tried.

**Azure Kubernetes Service (AKS)**

Assuming you are going with AKS, you have to then keep the following in mind:

- You'll be building your containers against some variant of NanoServer. Make sure you use a build of NanoServer that matches the build of Windows Server 2019 that AKS uses. I initially went with 1903 (since it was the latest) and that did not work. As of today, the version that works is build 1809. For ASP.NET Core apps, then, the correct base image to build your container off is `mcr.microsoft.com/dotnet/core/aspnet:2.2-nanoserver-1809` (see [here](https://hub.docker.com/_/microsoft-dotnet-core-aspnet/) for details).

- Again, realize that Windows Containers are still a preview or "experimental" feature even on AKS. You have to enable experimental/preview features in AKS first, BEFORE you provision your AKS cluster. Once again, the control plane still needs Linux - so you will need a cluster with 2 node pools. The provisioned cluster will include a single node pool based on Linux. You have to then add a Windows node pool where your Windows containers will be deployed. To do all this through the Azure CLI, you also have to install the `aks-preview` extension on the CLI. [This article](https://docs.microsoft.com/en-us/azure/aks/windows-container-cli) lays it all out.

All said though, as of today, it's all experimental so you can't really run production workloads. So if you're on Windows and are considering Kubernetes, you can use the above to start preparing for your eventual migration, or alternatively if you have the option, you can start preparing your application so it can run on Linux.