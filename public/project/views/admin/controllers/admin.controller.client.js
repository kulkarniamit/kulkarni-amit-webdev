(function () {
    angular
        .module('TheNewsNetwork')
        .controller("AdminProfileController",AdminProfileController);

    function AdminProfileController($rootScope, $location, UserService) {
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
