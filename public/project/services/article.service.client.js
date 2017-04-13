(function () {
    angular
        .module("TheNewsNetwork")
        .factory("ArticleService",ArticleService);

    function ArticleService($http) {
        var api = {
            "getArticlesCount":getArticlesCount,
            "findArticleById":findArticleById,
            "getSavedArticlesOfUser":getSavedArticlesOfUser,
            "removeArticle":removeArticle,
            "submitComment":submitComment,
            "deleteComment":deleteComment
        };
        return api;

        function getArticlesCount() {
            return $http.get("/api/project/articlecount");
        }
        function findArticleById(articleId) {
            return $http.get("/api/project/article/"+articleId);
        }
        function getSavedArticlesOfUser(userId) {
            return $http.get("/api/project/"+userId+"/saved");
        }

        function removeArticle(articleId, userId) {
            return $http.delete("/api/project/user/"+userId+"/publisher/article/"+articleId);
        }

        function submitComment(articleId, comment) {
            return $http.post("/api/project/article/"+articleId+"/comment",comment);
        }

        function deleteComment(articleId, commentId) {
            return $http.delete("/api/project/article/"+articleId+"/comment/"+commentId);
        }
    }
})();
