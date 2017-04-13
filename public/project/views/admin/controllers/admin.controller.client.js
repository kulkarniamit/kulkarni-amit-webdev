(function () {
    angular
        .module('TheNewsNetwork')
        .controller("AdminProfileController",AdminProfileController)
        .controller("AdminUserCreateController",AdminUserCreateController)
        .controller("AdminPublisherManagementController",AdminPublisherManagementController)
        .controller("AdminReaderManagementController",AdminReaderManagementController)
        .controller("AdminArticleManagementController",AdminArticleManagementController);

    function AdminProfileController($rootScope, $location, UserService, AdminService, ArticleService) {
        var vm = this;
        vm.currentUser = $rootScope.currentUser;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        function init() {
            vm.unsaved = true;
            vm.currentUser = $rootScope.currentUser;
            vm.user = vm.currentUser;
            vm.userId = vm.user._id;
            vm.firstName = angular.copy(vm.user.firstName);
            vm.lastName = angular.copy(vm.user.lastName);
            AdminService
                .findAllUsers()
                .then(function (response) {
                    vm.users = response.data;
                    // Use this stat to show on dashboard of administrator
                    vm.numberOfPublishers = vm.users.filter(function(x){return x.role=="PUBLISHER"}).length;
                    vm.numberOfReaders = vm.users.filter(function(x){return x.role=="READER"}).length;
                    ArticleService
                        .getArticlesCount()
                        .then(function (response) {
                            vm.numberOfArticles = response.data;
                            AdminService
                                .getCommentsCount()
                                .then(function (response) {
                                    vm.numberOfComments = response.data;
                                },function (err) {
                                    console.log(err);
                                })
                        },function (err) {
                           console.log(err);
                        })
                },function (err) {
                    console.log(err);
                })
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
            bootbox.confirm({
                size: "small",
                message: "Are you sure you want to delete your account?",
                buttons:{
                    confirm: {
                        label: 'Yes',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                },
                callback: function(result){
                    /* result is a boolean; true = OK, false = Cancel*/
                    if(result){
                        // Admin wants to delete the user
                        UserService
                            .deleteUserById(userToDelete._id)
                            .success(function (response) {
                                $location.url("/login");
                            })
                            .error(function (response) {
                                vm.error = "User not found";
                            });
                    }
                    else{
                        // User accidentally hit delete
                    }
                }
            });
        }
        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url("/login");
                });
        }
    }
    function AdminUserCreateController($scope, $rootScope, $location, UserService, AdminService) {
        var vm = this;
        vm.currentUser = $rootScope.currentUser;
        vm.register = register;
        vm.logout = logout;

        function register(user) {
            vm.orgnameMissing = false;
            vm.registrationerror = false;
            vm.passwordmismatch = false;
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
            if(user.role == "PUBLISHER"){
                if(!user.organization){
                    vm.orgnameMissing = "Please enter the name of the organization";
                    return;
                }
            }
            UserService
                .findUserByUsername(user.username)
                .success(function(user){
                    // Method succeeded, and user exists
                    vm.registrationerror = "Username taken, please try another username";
                    vm.passwordmismatch = "";
                })
                .error(function (err) {
                    AdminService
                        .createUser(user)
                        .then(function(response) {
                            // var user = response.data;
                            vm.message = "User was created successfully";
                            vm.user = {};
                            $scope.form.$setPristine();
                            $scope.form.$setUntouched();
                            $('html,body').animate({scrollTop:0},800);
                        });
                });
        }

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url("/login");
                });
        }
    }
    function AdminReaderManagementController($rootScope, $location, UserService, AdminService) {
        var vm = this;
        vm.currentUser = $rootScope.currentUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        function init() {
            AdminService
                .findAllUsers()
                .then(function (response) {
                    vm.users = response.data;
                    vm.readers = vm.users.filter(function(x){return x.role == "READER"});
                },function (err) {
                    console.log(err);
                })
        }

        function deleteUser(userId) {
            bootbox.confirm({
                size: "small",
                message: "Are you sure you want to delete this user?",
                buttons:{
                    confirm: {
                        label: 'Yes',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                },
                callback: function(result){
                    /* result is a boolean; true = OK, false = Cancel*/
                    if(result){
                        // Admin wants to delete the user
                        UserService
                            .deleteUserById(userId)
                            .then(function (response) {
                                // User was successfully deleted
                                var deletedUserIndex = vm.readers.map(function (x) {return x._id}).indexOf(userId);
                                vm.readers.splice(deletedUserIndex, 1);
                            },function (err) {
                                console.log(err);
                            })
                    }
                    else{
                        // User accidentally hit delete
                    }
                }
            });
        }
        init();
        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url("/login");
                });
        }
    }
    function AdminPublisherManagementController($rootScope, $location, UserService, AdminService) {
        var vm = this;
        vm.currentUser = $rootScope.currentUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        function init() {
            AdminService
                .findAllUsers()
                .then(function (response) {
                    vm.users = response.data;
                    vm.publishers = vm.users.filter(function(x){return x.role == "PUBLISHER"});
                },function (err) {
                    console.log(err);
                })
        }
        init();
        function deleteUser(userId) {
            bootbox.confirm({
                size: "small",
                message: "Are you sure you want to delete this user?",
                buttons:{
                    confirm: {
                        label: 'Yes',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                },
                callback: function(result){
                    /* result is a boolean; true = OK, false = Cancel*/
                    if(result){
                        // Admin wants to delete the user
                        UserService
                            .deleteUserById(userId)
                            .then(function (response) {
                                // User was successfully deleted
                                var deletedUserIndex = vm.publishers.map(function (x) {return x._id}).indexOf(userId);
                                vm.publishers.splice(deletedUserIndex, 1);
                            },function (err) {
                                console.log(err);
                            })
                    }
                    else{
                        // User accidentally hit delete
                    }
                }
            });
        }
        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url("/login");
                });
        }
    }
    function AdminArticleManagementController($rootScope, $location, UserService, AdminService, ArticleService) {
        var vm = this;
        vm.currentUser = $rootScope.currentUser;
        vm.deleteArticle = deleteArticle;
        vm.logout = logout;

        function init() {
            AdminService
                .findAllArticles()
                .then(function (response) {
                    console.log(response.data);
                    vm.articles = response.data;
                },function (err) {
                    console.log(err);
                });
        }
        init();

        function deleteArticle(articleId) {
            bootbox.confirm({
                size: "small",
                message: "Are you sure you want to delete this article?",
                buttons:{
                    confirm: {
                        label: 'Yes',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                },
                callback: function(result){
                    /* result is a boolean; true = OK, false = Cancel*/
                    if(result){
                        // Admin wants to delete the article
                        ArticleService
                            .removeArticle(articleId)
                            .then(function (response) {
                                // Article deleted, remove from array
                                var deletedArticleIndex = vm.articles.map(function (x) {return x._id}).indexOf(articleId);
                                vm.articles.splice(deletedArticleIndex,1);
                            },function (err) {
                                console.log(err);
                            })
                    }
                    else{
                        // User accidentally hit delete
                    }
                }
            });
        }
        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url("/login");
                });
        }
    }
})();
