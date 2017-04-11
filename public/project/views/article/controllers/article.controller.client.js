(function () {
    angular
        .module('TheNewsNetwork')
        .controller("ArticleListController",ArticleListController)
        .controller("ArticleController",ArticleController);
    
    function ArticleListController($location, $rootScope, UserService, ArticleService) {
        var vm = this;
        vm.logout = logout;
        vm.removeBookmark = removeBookmark;
        vm.currentUser = $rootScope.currentUser;
        // vm.user = $rootScope.currentUser;
        function init() {
            ArticleService
                .getSavedArticlesOfUser(vm.currentUser._id)
                .then(function (response) {
                    vm.savedArticles = response.data.articles;
                },function (err) {
                    console.log(err);
                })
        }
        init();

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url("/login");
                });
        }
        function removeBookmark(articleId) {
            UserService
                .removeBookmark(vm.currentUser._id, articleId)
                .then(function (response) {
                    var removedArticleIndex = vm.savedArticles.map(function(x){return x._id}).indexOf(articleId);
                    vm.savedArticles.splice(removedArticleIndex,1);
                })
        }
    }
    function ArticleController($location, $routeParams, $rootScope, UserService, ArticleService) {
        var vm = this;
        vm.articleId = $routeParams['articleId'];
        vm.logout = logout;
        vm.currentUser = $rootScope.currentUser;
        // vm.user = $rootScope.currentUser;
        vm.bookmarkArticleById = bookmarkArticleById;
        vm.removeBookmark = removeBookmark;
        vm.removeArticle = removeArticle;
        vm.submitComment = submitComment;
        vm.deleteComment = deleteComment;
        vm.saved = false;
        vm.articleByPublisher = false;

        function init() {
            // Check if this article has already been bookmarked
            if(vm.currentUser.articles.map(function(x){return x._id}).indexOf(vm.articleId) > -1){
                // user has already saved this article
                vm.saved = true;
            }

            if(vm.currentUser.role == 'PUBLISHER'){
                // Check if this article was published by this publisher
                if(vm.currentUser.articles.map(function (x) {return x._id}).indexOf(vm.articleId) > -1){
                    // Yes, this article was written by this publisher
                    // Allow delete option
                    vm.articleByPublisher = true;
                }
            }

            ArticleService
                .findArticleById(vm.articleId)
                .then(function (response) {
                    vm.article = response.data;
                },function (err) {
                    console.log(err);
                });
        }
        init();

        function bookmarkArticleById(articleId) {
            UserService
                .bookmarkArticleById(vm.currentUser._id, articleId)
                .then(function (response) {
                    vm.saved = true;
                    vm.unsaved = null;
                },function (err) {
                    vm.unauthorized = "Please register/login to save articles";
                    console.log(err);
                })
        }
        function removeBookmark(articleId) {
            UserService
                .removeBookmark(vm.currentUser._id, articleId)
                .then(function (response) {
                    vm.saved = false;
                },function (err) {
                    vm.unauthorized = "Please register/login to save articles";
                    console.log(err);
                })
        }
        function removeArticle(articleId) {
            ArticleService
                .removeArticle(articleId,vm.currentUser._id)
                .then(function (response) {
                    vm.article = null;
                    vm.deleteSuccess = "Article successfully deleted";
                },function (err) {
                    console.log(err);
                })
        }
        function submitComment(comment) {
            ArticleService
                .submitComment(vm.article._id,comment)
                .then(function (response) {
                    var newComment = response.data;
                    vm.article.comments.unshift(newComment);
                    vm.comment = ""
                },function (err) {
                    console.log(err);
                })
        }

        function deleteComment(commentId) {
            ArticleService
                .deleteComment(vm.article._id, commentId)
                .then(function (response) {
                    // Comment was successfully deleted
                    var commentIndex = vm.article.comments.map(function(x){return x._id;}).indexOf(commentId);
                    vm.article.comments.splice(commentIndex,1);
                },function (err) {
                    console.log(err);
                })
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
