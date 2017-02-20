(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController)
        .controller("RegisterController", RegisterController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;
        function login(username, password) {
            // var user = UserService.findUserByCredentials(username,password);
            var promise = UserService.findUserByCredentials(username,password);
            promise.success(function (response) {
               var user = response;
                if(user == null){
                    vm.error = "Username/password does not match";
                    return null;
                }
                else{
                    $location.url("/user/"+user._id);
                }
            });
            // if(user == null){
            //     vm.error = "Username/password does not match";
            //     return null;
            // }
            // else{
            //     $location.url("/user/"+user._id);
            // }

        }
    }
    
    function ProfileController($routeParams, UserService, $location) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        function init() {
            var promise = UserService.findUserById(vm.userId);
            promise.success(function (user) {
                vm.user = user;
                if (vm.user == null){
                    $location.url("/login");
                }
                else{
                    vm.firstName = angular.copy(vm.user.firstName);
                }
            });
            // vm.user = UserService.findUserById(vm.userId);
            // if (vm.user == null){
            //     $location.url("/login");
            // }
            // else{
            //     vm.firstName = angular.copy(vm.user.firstName);
            // }
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
            // var user = UserService.updateUser(vm.userId, newUser);
            // vm.firstName = user.firstName;
            // if(user == null) {
            //     vm.error = "Unable to update user";
            // } else {
            //     vm.message = "User successfully updated"
            // }
        }

        function deleteUser(userToDelete) {
            var result = UserService.deleteUserById(userToDelete._id);
            if (result == null){
                vm.error = "User not found";
            }
            else{
                $location.url("/login");
                return;
            }
        }
    }
    
    function RegisterController($location, UserService) {
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
            UserService
                .findUserByUsername(user.username)
                .success(function(user){
                    // Method succeeded, and user exists
                        vm.registrationerror = "Username taken, please try another username";
                        vm.passwordmismatch = "";
                })
                .error(function (err) {
                    // There was an error, so the user does not exist
                    var newuser = UserService.createUser(user);
                    $location.url("/user/"+newuser._id);
                });
            // var userInDB = UserService.findUserByUsername(user.username);
            // if(userInDB != null){
            //     vm.registrationerror = "Username taken, please try another username";
            //     vm.passwordmismatch = "";
            //     return;
            // }
            // else{
            //     if (user.password != user.passwordverification){
            //         vm.registrationerror ="";
            //         vm.passwordmismatch = "Passwords do not match";
            //         return;
            //     }
            //     var newuser = UserService.createUser(user);
            //     $location.url("/user/"+newuser._id);
            // }
        }
    }
})();