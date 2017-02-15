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
            var user = UserService.findUserByCredentials(username,password);
            if(user == null){
                vm.error = "Username/password does not match";
                return null;
            }
            else{
                $location.url("/user/"+user._id);
            }

        }
    }
    
    function ProfileController($routeParams, UserService, $location) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        function init() {
            vm.user = UserService.findUserById(vm.userId);
            if (vm.user == null){
                $location.url("/login");
            }
            else{
                vm.firstName = angular.copy(vm.user.firstName);
            }
        }
        init();

        function updateUser(newUser) {
            vm.blankerror = null;
            vm.error = null;
            if(newUser.email == "" || newUser.firstName == ""||newUser.lastName == ""){
                vm.blankerror = "Please provide values for all fields to update";
                return;
            }
            var user = UserService.updateUser(vm.userId, newUser);
            vm.firstName = user.firstName;
            if(user == null) {
                vm.error = "Unable to update user";
            } else {
                vm.message = "User successfully updated"
            }
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
            var userInDB = UserService.findUserByUsername(user.username);
            if(userInDB != null){
                vm.registrationerror = "Username taken, please try another username";
                vm.passwordmismatch = "";
                return;
            }
            else{
                if (user.password != user.passwordverification){
                    vm.registrationerror ="";
                    vm.passwordmismatch = "Passwords do not match";
                    return;
                }
                var newuser = UserService.createUser(user);
                $location.url("/user/"+newuser._id);
            }
        }
    }
})();