(function () {
    angular
        .module("TheNewsNetwork")
        .factory("ArticleService",ArticleService);

    function ArticleService($http) {
        var api = {
            "getSavedArticlesOfUser":getSavedArticlesOfUser,
            "removeArticle":removeArticle
        };
        return api;

        function getSavedArticlesOfUser(userId) {
            return $http.get("/api/project/"+userId+"/saved");
        }

        function removeArticle(articleId, userId) {
            return $http.delete("/api/project/user/"+userId+"/publisher/article/"+articleId);
        }
    }
})();
