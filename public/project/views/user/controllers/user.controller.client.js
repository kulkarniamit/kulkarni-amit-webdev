(function() {
    angular
        .module("TheNewsNetwork")
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController)
        .controller("RegisterController", RegisterController);

    function LoginController($location, UserService, $rootScope) {
        var vm = this;
        vm.login = login;
        function login(user) {
            UserService
                .login(user)
                .then(function (response) {
                    var user = response.data;
                    $rootScope.currentUser = user;
                    $location.url("/user/"+user._id);
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

        if(vm.userId == vm.myUserId){
            vm.myProfile = true;
        }
        vm.followed = false;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.followPerson = followPerson;
        vm.unfollowPerson = unfollowPerson;
        vm.getNewsDetails = getNewsDetails;
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
                            vm.currentUser.articles = vm.currentUser.articles.map(function(x){return x._id});
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
})();