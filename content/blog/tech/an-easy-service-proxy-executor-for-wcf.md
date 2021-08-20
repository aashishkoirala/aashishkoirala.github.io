---
title: An Easy Service Proxy Executor for WCF
slug: an-easy-service-proxy-executor-for-wcf
date: 2014-05-15
draft: false
tags:
- csharp
- dotnet
- soa
- wcf
---
If you have adopted service oriented architecture ([SOA](https://en.wikipedia.org/wiki/Service-oriented_architecture)) and are using WCF as the hosting/communication mechanism for your internal services, chances are you are doing one of two things: you publish each service like any old WCF service and your other services which are consumers of said published service consume it through its WSDL; or you create shared libraries that include the contract information that both the service and its consumer reference. Both are somewhat cumbersome but can be managed. If all your services are internal, though, going the WSDL route is somewhat of an unnecessary overhead and is just a bit more unmanageable.

Now, if you decide to go the second route, but still stick to the more obvious interface that WCF provides to instantiate and call proxies (**ClientBase** and the like), that is a bit of a waste - since those classes were built with generated-code proxies in mind. In that case, the better option really is to have a mechanism to obtain a **ServiceEndpoint** and use that along with the contract information to create your own **ChannelFactory** - where you can then call _CreateChannel_ to get your proxy. A lot less code and a lot more manageable.

To this end, for my own purposes, I built a bunch of classes that comprise my WCF service executor module. This is part of the Services namespace in the new Commons Library. Here are what a few of the key classes look like - you should be able to surmise how they can be used. The most common usage example would be:

	var response = ServiceCallerFactory
	   .Create<IMyContract>()
	   .Call(x => x.MyOperation(request));

**IServiceCaller**

	public interface IServiceCaller<out TChannel>
	{
		 void Call(Action<TChannel> action);
		 TResult Call<TResult>(Func<TChannel, TResult> action);
	}

**ServiceCaller**

	public class ServiceCaller<TChannel> : IServiceCaller<TChannel>
	{
		  private readonly ServiceEndpoint endpoint;
		  private readonly EndpointAddress endpointAddress;

		  public ServiceCaller() {}

		  public ServiceCaller(ServiceEndpoint endpoint)
		   {
				 this.endpoint = endpoint;
		   }

		  public ServiceCaller(EndpointAddress endpointAddress)
		  {
				 this.endpointAddress = endpointAddress;
		  }

		  public void Call(Action<TChannel> action)
		  {
				 var channelFactory = this.endpoint != null
					   ? new ChannelFactory<TChannel>(this.endpoint)
					   : new ChannelFactory<TChannel>();

				if (this.endpointAddress != null) channelFactory.Endpoint.Address = endpointAddress;

				var channel = channelFactory.CreateChannel();
				 try
				 {
					   action(channel);
				 }
				 catch
				 {
					   channelFactory.Abort();
					   throw;
				 }
				 finally
				 {
					   channelFactory.Close();
				 }
		   }

		  public TResult Call<TResult>(Func<TChannel, TResult> action)
		  {
				 var channelFactory = this.endpoint != null
					   ? new ChannelFactory<TChannel>(this.endpoint)
					   : new ChannelFactory<TChannel>();

				var channel = channelFactory.CreateChannel();
				 try
				 {
					   return action(channel);
				 }
				 catch
				 {
					   channelFactory.Abort();
					   throw;
				 }
				 finally
				 {
					   channelFactory.Close();
				 }
		   }
	}

**ServiceCallerFactory**

	public static class ServiceCallerFactory
	{
		  private static readonly object serviceCallerMapLock = new object();

		  private static readonly IDictionary<Type, ServiceCaller> serviceCallerMap = new Dictionary<Type, ServiceCaller>();

		  public static Func<Type, ServiceEndpoint> ServiceEndpointAccessor { get; set; }

		  public static IServiceCaller<TChannel> Create<TChannel>(EndpointAddress endpointAddress = null)
		  {
				 ServiceCaller caller;
				 if (serviceCallerMap.TryGetValue(typeof (TChannel), out caller))
					   return (IServiceCaller<TChannel>) caller;

				lock (serviceCallerMapLock)
				{
					   if (serviceCallerMap.TryGetValue(typeof (TChannel), out caller))
							 return (IServiceCaller<TChannel>) caller;

					   if (ServiceEndpointAccessor != null)
					   {
							 var serviceEndpoint = ServiceEndpointAccessor(typeof (TChannel));
							 if (endpointAddress != null) serviceEndpoint.Address = endpointAddress;
							 caller = new ServiceCaller<TChannel>(serviceEndpoint);
					   }
					   else
					   {
							 caller = endpointAddress == null
								   ? new ServiceCaller<TChannel>()
								   : new ServiceCaller<TChannel>(endpointAddress); 
					   }

					  serviceCallerMap[typeof (TChannel)] = caller;
				}

				return (IServiceCaller<TChannel>) caller;
		  }
	}