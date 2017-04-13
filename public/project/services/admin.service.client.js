(function () {
    angular
        .module("TheNewsNetwork")
        .factory("AdminService",AdminService);

    function AdminService($http) {
        var api = {
            "findAllUsers":findAllUsers,
            "findAllArticles":findAllArticles,
            "createUser":createUser,
            "getCommentsCount":getCommentsCount
        };
        return api;

        function findAllUsers() {
            return $http.get("/api/project/admin/user");
        }
        function findAllArticles() {
            return $http.get("/api/project/admin/articles");
        }
        function createUser(user) {
            return $http.post("/api/project/admin/user/create",user);
        }
        function getCommentsCount() {
            return $http.get("/api/project/admin/commentcount");
        }
    }
})();
