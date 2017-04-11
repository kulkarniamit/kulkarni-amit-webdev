(function() {
    angular
        .module("TheNewsNetwork")
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController)
        .controller("RegisterController", RegisterController)
        .controller("PublisherController",PublisherController)
        .controller("ComposeController",ComposeController)
        .controller("PublishedArticlesController",PublishedArticlesController)
        .controller("SubscriberArticleListController",SubscriberArticleListController);

    function LoginController($location, UserService, $rootScope) {
        var vm = this;
        vm.login = login;
        function login(user) {
            UserService
                .login(user)
                .then(function (response) {
                    var user = response.data;
                    $rootScope.currentUser = user;
                    if(user.role == "ADMIN"){
                        $location.url("/admin/"+user._id);
                    }
                    else{
                        $location.url("/user/"+user._id);
                    }
                },function (err) {
                    vm.error = "Username/password does not match";
                });
        }
    }
    
    function ProfileController($routeParams, $location, $rootScope, UserService, SearchNewsService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.myProfile = false;
        vm.currentUser = $rootScope.currentUser;
        vm.myUserId = vm.currentUser._id;
        vm.subscribed = false;

        if(vm.userId == vm.myUserId){
            vm.myProfile = true;
        }
        vm.followed = false;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.followPerson = followPerson;
        vm.unfollowPerson = unfollowPerson;
        vm.getNewsDetails = getNewsDetails;
        vm.subscribePublisher = subscribePublisher;
        vm.unsubscribePublisher = unsubscribePublisher;
        vm.logout = logout;

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url("/login");
                });
        }

        function init() {
            UserService
                .findUserById(vm.userId)
                .then(function (response) {
                    vm.user = response.data;
                    if (vm.user == null){
                        $location.url("/login");
                    }
                    else{
                        vm.firstName = angular.copy(vm.user.firstName);
                        if(!vm.myProfile){
                            // Go through myprofile array of user and set
                            // vm.followed depending on whether this profile
                            // user exists or not
                            var followedIndex = vm.currentUser.following.map(function(x){return x._id;}).indexOf(vm.userId);
                            if(followedIndex > -1){
                                // Already followed the user
                                vm.followed = true;
                            }
                            // vm.currentUser.articles = vm.currentUser.articles.map(function(x){return x._id});
                            // Check if I am on a publishers profile
                            var publisherIndex = vm.currentUser.publishers.indexOf(vm.userId);
                            if(publisherIndex > -1){
                                vm.subscribed = true;
                            }
                        }
                    }
                });
        }
        init();

        function updateUser(newUser) {
            vm.blankerror = null;
            vm.error = null;
            if(newUser.email == "" || newUser.firstName == ""||newUser.lastName == ""){
                vm.blankerror = "Please provide values for all fields to update";
                return;
            }
            UserService
                       .updateUser(vm.userId, newUser)
                       .success(function (user) {
                            if(user == null) {
                                vm.error = "Unable to update user";
                                vm.user = user;
                            }
                            else {
                                vm.firstName = user.firstName;
                                vm.message = "User successfully updated"
                            }
            });
        }
        function deleteUser(userToDelete) {
            UserService
                .deleteUserById(userToDelete._id)
                .success(function (response) {
                    $location.url("/login");
                })
                .error(function (response) {
                    vm.error = "User not found";
                });
        }
        function followPerson(userIdToFollow) {
            UserService
                .followPerson(userIdToFollow,vm.myUserId)
                .then(function (response) {
                    // If a person is trying to follow someone, it means they are on
                    // the other person's profile page
                    // Hence, vm.user is the person who was just followed by
                    // current user
                    vm.user.followers.push(response.data);
                    vm.followed = true;
                })
        }
        function unfollowPerson(userIdToUnfollow) {
            UserService
                .unfollowPerson(userIdToUnfollow,vm.myUserId)
                .then(function (response) {
                    // Update the vm.users.followers list (Remove the current user from that list)
                    var followerIndex = vm.user.followers.map(function(x){return x._id;}).indexOf(vm.currentUser._id);
                    vm.user.followers.splice(followerIndex,1);
                    vm.followed = false;
                })
        }
        function getNewsDetails(index) {
            SearchNewsService.setLastClickedSearchDetails(vm.user.articles[index]);
            $location.url('/searchdetails');
        }
        function subscribePublisher(publisherId) {
            UserService
                .subscribe(publisherId,vm.myUserId)
                .then(function (response) {
                    // If a person is trying to follow someone, it means they are on
                    // the other person's profile page
                    // Hence, vm.user is the person who was just followed by
                    // current user
                    vm.user.subscribers.push(response.data);
                    vm.subscribed = true;
                })
        }
        function unsubscribePublisher(publisherId){
            UserService
                .unsubscribe(publisherId,vm.myUserId)
                .then(function (response) {
                    // Update the vm.users.subscribers list (Remove the current user from that list)
                    var subscriberIndex = vm.user.subscribers.map(function(x){return x._id;}).indexOf(vm.currentUser._id);
                    vm.user.subscribers.splice(subscriberIndex, 1);
                    vm.subscribed = false;
                })
        }

    }
    
    function RegisterController($location, UserService, $rootScope) {
        var vm = this;
        vm.register = register;

        function register(user) {
            if(user == null){
                vm.registrationerror = "Please enter your username, email and password";
                return;
            }
            if(user.username == null || user.email == null || user.password == null){
                vm.registrationerror = "Please enter your username, email and password";
                return;
            }
            if (user.password != user.passwordverification){
                vm.registrationerror ="";
                vm.passwordmismatch = "Passwords do not match";
                return;
            }
            if(user.organization){
                user.role = "PUBLISHER";
            }
            UserService
                .findUserByUsername(user.username)
                .success(function(user){
                    // Method succeeded, and user exists
                        vm.registrationerror = "Username taken, please try another username";
                        vm.passwordmismatch = "";
                })
                .error(function (err) {
                    // There was an error, so the user does not exist
                    // UserService
                    //     .createUser(user)
                    //     .success(function (newuser) {
                    //         $location.url("/user/"+newuser._id);
                    //     });

                    UserService
                        .register(user)
                        .then(function(response) {
                            var user = response.data;
                            $rootScope.currentUser = user;
                            $location.url("/user/"+user._id);
                            // $location.url("/project/profile");
                        });
                });
        }
    }

    function PublisherController($location, $routeParams, $rootScope, UserService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.currentUser = $rootScope.currentUser;    // Required to provide profile link using ID
        vm.logout = logout;

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url("/login");
                });
        }

        function init() {
            UserService
                .findAllPublishers()
                .then(function (response) {
                    vm.publishers = response.data;
                },function (err) {
                    console.log(err);
                });
        }
        init()
    }

    function ComposeController($scope, $location, $routeParams, $rootScope, SearchNewsService, UserService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.currentUser = $rootScope.currentUser;    // Required to provide profile link using ID
        vm.submitArticle = submitArticle;
        vm.logout = logout;

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url("/login");
                });
        }

        function submitArticle(article) {
            article._user = vm.currentUser._id;
            if(article){
                if(article.title != "" && article.description != "" && article.author != ""){
                    SearchNewsService
                        .saveArticle(article)
                        .then(function (response) {
                            vm.message = "Article successfully posted";
                            // Reset the form
                            vm.publisher = {};
                            $scope.composer.$setPristine();
                            $scope.composer.$setUntouched();
                        },function (err) {
                            console.log(err);
                        });
                }
            }
            else{
                vm.blankFormError = "Please enter the required details to submit the form";
            }
        }
    }

    function PublishedArticlesController($routeParams, $location, $rootScope, UserService, ArticleService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.currentUser = $rootScope.currentUser;    // Required to provide profile link using ID
        // vm.removeArticle = removeArticle;
        vm.logout = logout;
        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url("/login");
                });
        }

        function init() {
            // Fetch all articles written by publisher
            UserService
                .findPublishedArticles(vm.currentUser._id)
                .then(function (response) {
                    vm.publishedArticles = response.data;
                },function (err) {
                    console.log(err);
                })
        }
        init();

        // function removeArticle(articleId) {
        //     ArticleService
        //         .removeArticle(articleId,vm.currentUser._id)
        //         .then(function (response) {
        //             vm.deleteSuccess = "Article successfully deleted";
        //             var deletedArticleIndex = vm.publishedArticles.map(function (x) {return x._id}).indexOf(articleId);
        //             vm.publishedArticles.splice(deletedArticleIndex,1);
        //         },function (err) {
        //             console.log(err);
        //         })
        // }
    }

    function SubscriberArticleListController($routeParams, $location, $rootScope, UserService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.currentUser = $rootScope.currentUser;    // Required to provide profile link using ID
        vm.logout = logout;
        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url("/login");
                });
        }

        function init() {
            // Fetch and populate all the articles from the people I have subscribed to
            UserService
                .findAllMySubscribedArticles(vm.currentUser._id)
                .then(function (response) {
                    vm.subscribedArticles = [];
                    response.data.publishers.map(function(x){
                        x.articles.map(function(y){
                            y.organization = x.organization;
                            vm.subscribedArticles.push(y)
                        })
                    })
                },function (err) {
                    console.log(err);
                })
        }
        init()
    }
})();