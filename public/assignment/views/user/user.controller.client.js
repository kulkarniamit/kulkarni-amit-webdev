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
    }
    
    function RegisterController() {
        
    }
})();