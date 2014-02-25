angular.module('akApp', []).controller('akCtrl', function ($scope) {
    $scope.blogs = [];
    $scope.socials = [];
    $scope.commits = [];
    $scope.projects = [];

    $scope.loadBlogs = function () {
        var blogFeedPointer = new google.feeds.Feed('http://aashishkoirala.wordpress.com/feed/');
        blogFeedPointer.setNumEntries(10);
        blogFeedPointer.load(function (result) {
            if (!result.error) $scope.blogs = result.feed.entries;
            else scope.blogs = [];
            $scope.$apply();
        });
    };

    $scope.loadCommits = function () {
        var commitFeedPointer = new google.feeds.Feed('https://github.com/aashishkoirala.atom');
        commitFeedPointer.setNumEntries(10);
        commitFeedPointer.load(function (result) {
            if (!result.error) $scope.commits = result.feed.entries;
            else $scope.commits = [];
            $scope.$apply();
        });
    };

    $scope.loadSocials = function () {
        $scope.socials = [
            { icon: 'images/github.png', text: 'GitHub', link: 'http://github.com/aashishkoirala' },
            { icon: 'images/twitter.png', text: 'Twitter', link: 'http://twitter.com/aashishkoirala' },
            { icon: 'images/linkedin.png', text: 'LinkedIn', link: 'http://www.linkedin.com/in/aashishkoirala' }
        ];
    };

    $scope.loadProjects = function () {
        $scope.projects = [{
            title: 'Commons Library', ghpage: 'http://aashishkoirala.github.io/commons/', ghrepo: 'http://github.com/aashishkoirala/commons/', nuget: 'https://www.nuget.org/packages/ak.commons',
            description: 'This is a general purpose commons library that I\'ve built mostly for my own use within applications that I build (but obviously you are welcome to use it should you choose). The goal is to have an easy-to-use and uniform yet modular and pluggable facility to handle common cross-cutting concerns in my applications, thereby freeing me up to focus on the actual application concerns and hopefully making it easier and faster to build them. In general, the library consists of interfaces or SPIs along with ways to access them (using MEF). One can then build implementations for these interfaces (i.e. providers) and hook them up to an application through configuration. What this does for me is provide a uniform way to access these services in all my applications while allowing me to switch or extend providers as I see fit.'
        }, {
            title: 'Commons Library: Provider Set', ghpage: 'http://aashishkoirala.github.io/commons-providers/', ghrepo: 'http://github.com/aashishkoirala/commons-providers/', 
            description: 'This provider set compliments my commons library and includes certain implementations of interfaces in the commons library. These "providers" can be included and consumed by any application that uses the commons library via MEF and the commons library configuration mechanism. You can get each individual provider as a NuGet package.'
        }, {
            title: 'Modeling Kit: Text Templating Library', ghpage: 'http://aashishkoirala.github.io/modeling/', ghrepo: 'http://github.com/aashishkoirala/modeling/', nuget: 'https://www.nuget.org/packages/ak.modeling.texttemplating',
            description: 'This is the future home of my full-blown modeling kit. I envision a DSL based tool that lets you model a domain and generates a whole bunch of code for you. For the moment though, this is limited to a text-templating library that includes helper methods that you can use in your T4 templates. The scope is limited to generation of entities and repositories following the data access interface in my commons library - the entities being modeled as JSON files.'
		}, {
			title: 'Finance Manager', ghpage: 'http://aashishkoirala.github.io/financemanager/', ghrepo: 'http://github.com/aashishkoirala/financemanager/',
			description: 'This is a tool I built to keep track of my personal finances. It lets you create a period budget, and lets you record your transactions so that you can track it against the budget. It is an ASP.NET MVC/Web API SPA web application that uses AngularJS and Bootstrap on the frontend.'
		}, {
			title: 'To Do', ghpage: 'http://aashishkoirala.github.io/todo/', ghrepo: 'http://github.com/aashishkoirala/todo/', application: 'http://todo-17.apphb.com',
			description: 'This is a very light-weight to-do application. It lets you create tasks or "to-do items" - assign due dates (and optionally start dates) to them, categorize them, mark them as started, paused or complete, etc. It is an ASP.NET MVC/Web API SPA web application that uses AngularJS and Bootstrap on the frontend, and uses MongoDB as its database.'
		}, {
			title: 'My Lists', ghpage: 'http://aashishkoirala.github.io/mylists/', ghrepo: 'http://github.com/aashishkoirala/mylists/', application: 'http://mylists.apphb.com',
			description: 'This is a very light-weight list-maker application. It lets you create lists of things, and cross them off as you need to. The UI is responsive so you can get the same level of experience on the desktop and on mobile devices. This application is ideal for grocery lists, shopping lists, invitee lists and other scenarios where you need checklists. It is an ASP.NET MVC/Web API SPA web application that uses AngularJS and Bootstrap (with Responsiveness) on the frontend, and uses MongoDB as its database.'
		}, {
			title: 'RudyMQ - A rudimentary message queue', ghpage: 'http://aashishkoirala.github.io/rudymq', ghrepo: 'http://github.com/aashishkoirala/rudymq/',
			description: 'RudyMQ is a lightweight message queue for Windows built using .NET and WCF that you may want to consider if you do not need the enterprise grade features of MSMQ and do not want to deal with all of its tantrums and oh-so-friendly error messages. It supports persistent messages and also comes with its own WCF binding.'
		}, {
			title: 'Aspects for .NET', ghpage: 'http://aashishkoirala.github.io/aspects', ghrepo: 'http://github.com/aashishkoirala/aspects/', nuget: 'https://nuget.org/packages/aspects',
			description: 'Aspects for .NET is a library that you can use to add aspect orientation to your .NET application. It provides interfaces that you can implement to build your own aspects which you can then apply to your implementation classes. It also then provides a mechanism to wrap, at runtime, your implementation with aspects (and no, it does not mess with the MSIL post-compilation). There is also integrated support for MEF, albeit with some limitations.'
		}];
    };

    $scope.loadSocials();
    $scope.loadBlogs();
    $scope.loadCommits();
    $scope.loadProjects();
});