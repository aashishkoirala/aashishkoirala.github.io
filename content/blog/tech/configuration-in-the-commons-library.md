---
title: Configuration in the Commons Library
slug: configuration-in-the-commons-library
date: 2013-08-15
draft: false
tags:
- csharp
- dotnet
- architecture
---
When working on the configuration block in the [Commons Library]({{< ref "the-commons-library" >}}), I started out wanting to decouple the storage of configuration data and the format of that data from the actual configuration interface used by consumers to retrieve that data. I wanted consumers to be able to simply look up configuration data through a dictionary-style interface while the job of parsing the original format would be done by a configuration formatting provider and the job of getting that data from wherever would be done by a configuration store provider. Eventually, I settled on just following the .NET `System.Configuration` style XML format- as it is somewhat of a standard now, with a lot of other library builders also using it for their configuration needs. Besides, you diverge from this format and then you have to start rolling your own for tedious things like WCF configuration or diagnostics and tracing configuration - definitely a rat-hole I did not want to go down.

I was still adamant about being able to break free from `Web.config` or `App.config` and get that chunk of XML from anywhere I want. Thus I built it so that it expects an `IConfigStore` that will give it the XML it needs. The implementation of `IConfigStore` can then care about where to get it from. I've put in simple built-in implementations for XML files and HTTP URLs. Other possibilities include databases, a web service, or perhaps Azure Blob Storage.

Since we can now decouple the configuration data from the application, the other possibility this leads to is being able to store configuration for multiple applications in the same store. In enterprise situations, one runs into this often where you have disparate applications running God knows where, and they all need access to configuration - and that configuration needs to be in sync. You can therefore define multiple application blocks within the configuration XML using my custom configuration section. You can also define a global application block for common settings that can then be overridden by application specific settings.

I also wanted individual configuration entries to be strongly typed (as opposed to strings in `appSettings`) - so you can (in fact, you need to) specify the data type of each configuration entry. They can then be retrieved using something like `config.Get<string>(...)` or `config.Get<int>(...)` and so forth. This leads to another nice-to-have that is in place- the ability to embed simple serializable objects within the application settings block. You can do this by specifying the type of the object - and then assigning properties or constructor parameters.

The last feature I wanted to put in place was the ability to tokenize certain configuration entries using placeholders that I can define in one place (or multiple places, depending on what I need). You can therefore put a whole bunch of placeholders all across the configuration XML as long as you define the values for them in the `tokens` section within the application block. You can also define different values for different applications and on a global level. An example usage would be you have a certain pattern of WCF endpoint URLs you follow, but one part is different for different applications.

You can find more technical details in the *Configuration* section [here](http://aashishkoirala.github.io/commons/). Needless to say, feedback and suggestions for improvement are more than welcome.