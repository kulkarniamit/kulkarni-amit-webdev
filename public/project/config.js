(function () {
    angular
        .module("TheNewsNetwork")
        .config(configuration);

    var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope) {
        return $http.get('/api/project/loggedin').success(function(user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
            } else{
                $location.url('/login');
            }
        });
    };
    var loadUserToRootScope = function($q, $timeout, $http, $location, $rootScope) {
        return $http.get('/api/project/loggedin').success(function(user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
            }
        });
    };
    var redirectToProfile = function($q, $timeout, $http, $location, $rootScope) {
        return $http.get('/api/project/loggedin').success(function(user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $location.url('/user/'+user._id);
            } else{
                if($location.path() != "/"){
                    $location.url('/login');
                }
            }
        });
    };

    function isAdmin($q, UserService, $location, $rootScope) {
        return UserService
            .isAdmin()
            .then(function (response) {
                user = response.data;
                if(user == '0') {
                    $location.url('/login');
                } else {
                    $rootScope.errorMessage = null;
                    $rootScope.currentUser = user;
                    // $location.url('/admin/'+user._id);
                }
            });
    }

    function configuration($routeProvider, $httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type']='application/json;charset=UTF-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8';
        $routeProvider
            .when("/", {
                templateUrl: 'views/home/templates/home.view.client.html',
                controller: "HomeController",
                controllerAs: "model",
                resolve: { loggedin: redirectToProfile }
            })
            .when("/admin/manage/reader",{
                templateUrl: 'views/admin/templates/admin-reader-management.view.client.html',
                controller: "AdminReaderManagementController",
                controllerAs: "model",
                resolve: {
                    adminUser: isAdmin
                }
            })
            .when("/admin/manage/publisher",{
                templateUrl: 'views/admin/templates/admin-publisher-management.view.client.html',
                controller: "AdminPublisherManagementController",
                controllerAs: "model",
                resolve: {
                    adminUser: isAdmin
                }
            })
            .when("/admin/manage/articles",{
                templateUrl: 'views/admin/templates/admin-article-management.view.client.html',
                controller: "AdminArticleManagementController",
                controllerAs: "model",
                resolve: {
                    adminUser: isAdmin
                }
            })
            .when("/admin/manage/user/create",{
                templateUrl: 'views/admin/templates/admin-user-create.view.client.html',
                controller: "AdminUserCreateController",
                controllerAs: "model",
                resolve: {
                    adminUser: isAdmin
                }
            })
            .when("/admin/:uid",{
                templateUrl: 'views/admin/templates/admin-profile.view.client.html',
                controller: "AdminProfileController",
                controllerAs: "model",
                resolve: {
                    adminUser: isAdmin
                }
            })
            .when("/search", {
                templateUrl: 'views/search/templates/search.view.client.html',
                controller: "SearchController",
                controllerAs: "model",
                resolve: { loggedin: loadUserToRootScope }
            })
            .when("/searchdetails", {
                templateUrl: 'views/search/templates/searchdetails.view.client.html',
                controller: "SearchDetailsController",
                controllerAs: "model",
                resolve: { loggedin: loadUserToRootScope }
            })
            .when("/login", {
                templateUrl: 'views/user/templates/login.view.client.html',
                controller: "LoginController",
                controllerAs: "model",
                resolve: { loggedin: redirectToProfile }
            })
            .when("/register/reader",{
                templateUrl: 'views/user/templates/register-reader.view.client.html',
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/register/publisher",{
                templateUrl: 'views/user/templates/register-publisher.view.client.html',
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/user/publishers",{
                // Remember the order of this route is important
                // Do not push it below
                templateUrl: 'views/user/templates/publishers-list.view.client.html',
                controller: "PublisherController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedIn }
            })
            .when("/article/:articleId",{
                templateUrl: 'views/article/templates/article.view.client.html',
                controller: "ArticleController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedIn }
            })
            .when("/user/:uid/publisher/compose",{
                templateUrl: 'views/user/templates/publisher-compose.view.client.html',
                controller: "ComposeController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedIn }
            })
            .when("/user/:uid/publisher/articles",{
                templateUrl: 'views/user/templates/publisher-articles.view.client.html',
                controller: "PublishedArticlesController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedIn }
            })
            .when("/user/:uid",{
                templateUrl: 'views/user/templates/profile.view.client.html',
                controller: "ProfileController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedIn }
            })
            .when("/user/:uid/saved",{
                templateUrl: 'views/article/templates/article-list.view.client.html',
                controller: "ArticleListController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedIn }
            })
            .when("/user/:uid/subscriptions",{
                templateUrl: 'views/user/templates/subscriber-articles.view.client.html',
                controller: "SubscriberArticleListController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedIn }
            })
            // .when("/user/:uid/website/new",{
            //     templateUrl: 'views/website/website-new.view.client.html',
            //     controller: "NewWebsiteController",
            //     controllerAs: "model"
            // })
            // .when("/user/:uid/website/:wid",{
            //     templateUrl: 'views/website/website-edit.view.client.html',
            //     controller: "EditWebsiteController",
            //     controllerAs: "model"
            // })
            // .when("/user/:uid/website/:wid/page",{
            //     templateUrl: 'views/page/page-list.view.client.html',
            //     controller: "PageListController",
            //     controllerAs: "model"
            // })
            // .when("/user/:uid/website/:wid/page/new",{
            //     templateUrl: 'views/page/page-new.view.client.html',
            //     controller: "NewPageController",
            //     controllerAs: "model"
            // })
            // .when("/user/:uid/website/:wid/page/:pid",{
            //     templateUrl: 'views/page/page-edit.view.client.html',
            //     controller: "EditPageController",
            //     controllerAs: "model"
            // })
            // .when("/user/:uid/website/:wid/page/:pid/widget",{
            //     templateUrl: 'views/widget/templates/widget-list.view.client.html',
            //     controller: "WidgetListController",
            //     controllerAs: "model"
            // })
            // .when("/user/:uid/website/:wid/page/:pid/widget/new",{
            //     templateUrl: 'views/widget/templates/widget-chooser.view.client.html',
            //     controller: "NewWidgetController",
            //     controllerAs: "model"
            // })
            // .when("/user/:uid/website/:wid/page/:pid/widget/:wgid",{
            //     templateUrl: 'views/widget/templates/widget-edit.view.client.html',
            //     controller: "EditWidgetController",
            //     controllerAs: "model"
            // })
            // .when("/user/:uid/website/:wid/page/:pid/widget/:wgid/flickrsearch",{
            //     templateUrl: 'views/widget/templates/widget-flickr-search.view.client.html',
            //     controller: "FlickrImageSearchController",
            //     controllerAs: "model"
            // })
            .otherwise({
                // Default
                templateUrl: 'views/user/login.view.client.html'
            });
    }


})();