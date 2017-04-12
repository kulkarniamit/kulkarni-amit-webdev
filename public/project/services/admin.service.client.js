(function () {
    angular
        .module("TheNewsNetwork")
        .factory("AdminService",AdminService);

    function AdminService($http) {
        var api = {
            "findAllUsers":findAllUsers,
            "createUser":createUser
        };
        return api;

        function findAllUsers() {
            return $http.get("/api/project/admin/user");
        }

        function createUser(user) {
            return $http.post("/api/project/admin/user/create",user);
        }
    }
})();
