(function(){
    angular
        .module("WebAppMaker")
        .factory("UserService",UserService);

    function UserService($http) {
        var api={
            "login":login,
            "logout":logout,
            "createUser":createUser,
            "findUserById":findUserById,
            "findUserByUsername":findUserByUsername,
            "findUserByCredentials":findUserByCredentials,
            "updateUser":updateUser,
            "deleteUserById":deleteUserById
        };

        return api;
        function login(user) {
            return $http.post("/api/login", user);
        }

        function logout() {
            return $http.post("/api/logout");
        }

        function createUser(user) {
            return $http.post("/api/user/", user);
        }
        function findUserById(userid) {
            return $http.get("/api/user/"+userid);
        }
        function findUserByUsername(usernamesent) {
            return $http.get("/api/user?username="+usernamesent);
        }
        function findUserByCredentials(username, password) {
            return $http.get("/api/user?username="+username+"&password="+password);
        }
        function updateUser(userId, newUser) {
            return $http.put("/api/user/"+userId, newUser);
        }
        function deleteUserById(uid) {
            return $http.delete("/api/user/"+uid);
        }
    }
})();