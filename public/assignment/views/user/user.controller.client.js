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
        vm.navigateToWebsites = navigateToWebsites;
        vm.navigateToProfile = navigateToProfile;

        function init() {
            vm.user = UserService.findUserById(vm.userId);
            if (vm.user == null){
                $location.url("/login");
            }
        }
        init();

        function navigateToWebsites() {
            $location.url("/user/"+vm.userId+"/website");
        }

        function navigateToProfile() {
            $location.url("/user/"+vm.userId);
        }
    }
    
    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(user) {
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