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
        }];
    };

    $scope.loadSocials();
    $scope.loadBlogs();
    $scope.loadCommits();
    $scope.loadProjects();
});