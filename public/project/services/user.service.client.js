(function(){
    angular
        .module("TheNewsNetwork")
        .factory("UserService",UserService);

    function UserService($http) {
        var api={
            "login":login,
            "logout":logout,
            "isAdmin":isAdmin,
            "register":register,
            // "createUser":createUser,
            "findUserById":findUserById,
            "findUserByUsername":findUserByUsername,
            "findUserByCredentials":findUserByCredentials,
            "updateUser":updateUser,
            "deleteUserById":deleteUserById,
            "removeBookmark":removeBookmark,
            "followPerson":followPerson,
            "unfollowPerson":unfollowPerson,
            "findAllPublishers":findAllPublishers,
            "subscribe":subscribe,
            "unsubscribe":unsubscribe,
            "findPublishedArticles":findPublishedArticles,
            "findAllMySubscribedArticles":findAllMySubscribedArticles,
            "bookmarkArticleById":bookmarkArticleById
        };

        return api;
        function login(user) {
            return $http.post("/api/project/login", user);
        }

        function logout() {
            return $http.post("/api/project/logout");
        }

        function isAdmin() {
            return $http.get("/api/project/isAdmin");
        }

        function register(user) {
            return $http.post("/api/project/register", user);
        }
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

        function followPerson(userIdToFollow, myUserId) {
            return $http.put("/api/project/user/"+myUserId+"/follow/"+userIdToFollow);
        }

        function unfollowPerson(userIdToUnfollow,myUserId) {
            return $http.put("/api/project/user/"+myUserId+"/unfollow/"+userIdToUnfollow);
        }

        function findAllPublishers() {
            return $http.get("/api/project/user/publishers");
        }

        function subscribe(publisherId, myUserId) {
            return $http.put("/api/project/user/"+myUserId+"/subscribe/"+publisherId);
        }

        function unsubscribe(publisherId,myUserId) {
            return $http.put("/api/project/user/"+myUserId+"/unsubscribe/"+publisherId);
        }

        function findPublishedArticles(publisherId) {
            return $http.get("/api/project/user/publisher/articles/"+publisherId);
        }

        function findAllMySubscribedArticles(userId) {
            return $http.get("/api/project/user/"+userId+"/subscriber/articles");
        }

        function bookmarkArticleById(userId, articleId) {
            return $http.put("/api/project/user/"+userId+"/article/"+articleId);
        }

    }
})();