(function () {
    angular
        .module("TheNewsNetwork")
        .factory("ArticleService",ArticleService);

    function ArticleService($http) {
        var api = {
            "getSavedArticlesOfUser":getSavedArticlesOfUser
        };
        return api;

        function getSavedArticlesOfUser(userId) {
            return $http.get("/api/project/"+userId+"/saved");
        }
    }
})();
