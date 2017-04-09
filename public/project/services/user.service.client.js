(function(){
    angular
        .module("TheNewsNetwork")
        .factory("UserService",UserService);

    function UserService($http) {
        var api={
            "login":login,
            "logout":logout,
            "register":register,
            // "createUser":createUser,
            "findUserById":findUserById,
            "findUserByUsername":findUserByUsername,
            "findUserByCredentials":findUserByCredentials,
            "updateUser":updateUser,
            "deleteUserById":deleteUserById,
            "removeBookmark":removeBookmark
        };

        return api;
        function login(user) {
            return $http.post("/api/project/login", user);
        }

        function logout() {
            return $http.post("/api/project/logout");
        }

        function register(user) {
            return $http.post("/api/project/register", user);
        }
        // function createUser(user) {
        //     return $http.post("/api/user/", user);
        // }
        function findUserById(userid) {
            return $http.get("/api/project/user/"+userid);
        }
        function findUserByUsername(usernamesent) {
            return $http.get("/api/project/user?username="+usernamesent);
        }
        function findUserByCredentials(username, password) {
            return $http.get("/api/project/user?username="+username+"&password="+password);
        }
        function updateUser(userId, newUser) {
            return $http.put("/api/project/user/"+userId, newUser);
        }
        function deleteUserById(uid) {
            return $http.delete("/api/project/user/"+uid);
        }

        function removeBookmark(uid, articleId) {
            return $http.delete("/api/project/user/"+uid+"/article/"+articleId);
        }
    }
})();