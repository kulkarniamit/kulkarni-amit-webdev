(function () {
    angular
        .module('TheNewsNetwork')
        .controller("ArticleListController",ArticleListController)
        .controller("ArticleController",ArticleController);
    
    function ArticleListController($location, $rootScope, UserService, ArticleService) {
        var vm = this;
        vm.logout = logout;
        vm.removeBookmark = removeBookmark;
        vm.user = $rootScope.currentUser;
        function init() {
            ArticleService
                .getSavedArticlesOfUser(vm.user._id)
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
                .removeBookmark(vm.user._id, articleId)
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
        vm.user = $rootScope.currentUser;
        vm.saved = false;
        function init() {
            // Check if this article has already been bookmarked
            if(vm.user.articles.map(function(x){return x._id}).indexOf(vm.articleId) > -1){
                // user has already saved this article
                vm.saved = true;
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
