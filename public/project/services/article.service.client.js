(function () {
    angular
        .module("TheNewsNetwork")
        .factory("ArticleService",ArticleService);

    function ArticleService($http) {
        var api = {
            "findArticleById":findArticleById,
            "getSavedArticlesOfUser":getSavedArticlesOfUser,
            "removeArticle":removeArticle
        };
        return api;

        function findArticleById(articleId) {
            return $http.get("/api/project/article/"+articleId);
        }
        function getSavedArticlesOfUser(userId) {
            return $http.get("/api/project/"+userId+"/saved");
        }

        function removeArticle(articleId, userId) {
            return $http.delete("/api/project/user/"+userId+"/publisher/article/"+articleId);
        }
    }
})();
