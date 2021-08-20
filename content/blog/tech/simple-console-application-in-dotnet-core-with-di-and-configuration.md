---
title: Simple Console Application in .NET Core with DI and Configuration
slug: simple-console-application-in-dotnet-core-with-di-and-configuration
date: 2020-07-21
draft: false
tags:
- dotnet
- dotnetcore
- csharp
- dependencyinjection
- configuration
---
While the .NET Core documentation and libraries do a good job of providing an easy way to get started with hosted apps (web or otherwise), it is somewhat lacking in terms of the same guidance for simple run-to-completion type console apps. You can write a simple `Main()` method and do your stuff, but how do you get the advantage of the amazing configuration and dependency injection that you get out of the box with hosted apps? Surely, you could set up all that machinery and maybe create an `IHostedService` implementation just to get going. Even then, you are still left with a hosted app that you have to deal with shutting down after your logic is done.

If you look behind the builder methods that come out of the box with hosted apps, you will find that there is an easy way to get the good DI and configuration stuff and keep your simple `Main()` method app simple. To that end, I've written up a little `ProgramRunner` class that you can plop in and use as so (example .NET Core 3.1 code follows):

    public class ProgramOptions
    {
        public string SomeOption { get; set; }
    }

    public class Program
    {
        private readonly ProgramOptions _programOptions;

        public Program(IOptions<ProgramOptions> programOptions) => _programOptions = programOptions.Value;

        public static void Main(string[] args)
        {
            ProgramRunner
                .WithConfiguration(c => c.AddJsonFile("appsettings.json"))
                .AndServices((s, c) => s
                    .Configure<ProgramOptions>(o => c.Bind(o))
                    .AddSingleton<Program>())
                .Run(p => p.GetService<Program>().Run());
        }

        public void Run() => Console.WriteLine(_programOptions.SomeOption);
    }


Easy.

Here is the code for `ProgramRunner` referenced above (perhaps I will put it into a library at some point):

    public class ProgramRunner
    {
        private Action<IConfigurationBuilder> _configurationBuilderAction;
        private Action<IServiceCollection, IConfiguration> _serviceCollectionAction;

        private ProgramRunner() { }

        public ProgramRunner AndConfiguration(Action<IConfigurationBuilder> configurationBuilderAction)
        {
            _configurationBuilderAction = configurationBuilderAction;
            return this;
        }

        public ProgramRunner AndServices(Action<IServiceCollection, IConfiguration> serviceCollectionAction)
        {
            _serviceCollectionAction = serviceCollectionAction;
            return this;
        }

        public static ProgramRunner WithConfiguration(Action<IConfigurationBuilder> configurationBuilderAction) => new ProgramRunner().AndConfiguration(configurationBuilderAction);
        public static ProgramRunner WithServices(Action<IServiceCollection, IConfiguration> serviceCollectionAction) => new ProgramRunner().AndServices(serviceCollectionAction);

        private IServiceProvider GetServiceProvider()
        {
            var configurationBuilder = new ConfigurationBuilder();
            _configurationBuilderAction?.Invoke(configurationBuilder);
            
            var configuration = configurationBuilder.Build();

            var serviceCollection = new ServiceCollection();
            _serviceCollectionAction?.Invoke(serviceCollection, configuration);
            
            return serviceCollection.BuildServiceProvider();
        }

        public void Run(Action<IServiceProvider> runAction) => runAction(GetServiceProvider());
        
        public T Run<T>(Func<IServiceProvider, T> runAction) => runAction(GetServiceProvider());
        
        public Task RunAsync(Func<IServiceProvider, CancellationToken, Task> runAction, CancellationToken cancellationToken = default) => runAction(GetServiceProvider(), cancellationToken);
        
        public Task<T> RunAsync<T>(Func<IServiceProvider, CancellationToken, Task<T>> runAction, CancellationToken cancellationToken = default) => runAction(GetServiceProvider(), cancellationToken);

And there you have it.