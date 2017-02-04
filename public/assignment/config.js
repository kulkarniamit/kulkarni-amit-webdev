(function () {
    angular
        .module("WebAppMaker")
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when("/login",{
                templateUrl: 'views/user/login.view.client.html'
                // controller: "LoginController",
                // controllerAs: "model"
            })
            .when("/register",{
                templateUrl: 'views/user/register.view.client.html'
                // controller: "RegisterController",
                // controllerAs: "model"
            })
            .when("/profile",{
                templateUrl: 'views/user/profile.view.client.html'
                // controller: "ProfileController",
                // controllerAs: "model"
            })
    }
})();