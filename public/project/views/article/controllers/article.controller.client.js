(function () {
    angular
        .module('TheNewsNetwork')
        .controller("ArticleListController",ArticleListController);
    
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
})();
