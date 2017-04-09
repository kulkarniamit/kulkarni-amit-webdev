(function () {
    angular
        .module('TheNewsNetwork')
        .controller("HomeController",HomeController);
    
    function HomeController($location, HomeNewsService, SearchNewsService) {
        var vm = this;
        vm.getNews = getNews;
        vm.getNewsDetails = getNewsDetails;
        $('.carousel').carousel({
            interval: 3000
        })

        function init() {
            vm.getNews();
        }
        init();

        function getNews() {
            HomeNewsService
                .searchNews()
                .then(function(response) {
                    vm.homenews = response.data.articles;
                });

        }

        function getNewsDetails(index) {
            SearchNewsService.setLastClickedSearchDetails(vm.homenews[index]);
            $location.url('/searchdetails');
        }
    }
})();
