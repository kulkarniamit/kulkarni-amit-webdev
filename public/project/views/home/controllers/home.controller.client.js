(function () {
    angular
        .module('TheNewsNetwork')
        .controller("HomeController",HomeController);
    
    function HomeController($location, HomeNewsService,SearchNewsService) {
        var vm = this;
        vm.getNews = getNews;
        vm.getNewsDetails = getNewsDetails;
        $('.carousel').carousel({
            interval: 3000
        })

        function init() {
            vm.getNews();
            // vm.homenews = [{
            //                     "author":"Rachel Kaser",
            //                     "title":"WikiLeaks reveals Grasshopper, the CIA's Windows hacking tool",
            //                     "description":"In case you haven’t had your dose of paranoia fuel today, WikiLeaks released new information concerning a CIA malware program called “Grasshopper,” that specifically targets Windows. The Grasshopper framework was (is?) allegedly used by the CIA to make custom malware payloads. According to the user guide: Grasshopper is a software tool used to build custom installers for target …",
            //                     "url":"https://thenextweb.com/security/2017/04/07/wikileaks-reveals-grasshopper-cias-windows-hacking-tool/",
            //                     "urlToImage":"https://cdn3.tnwcdn.com/wp-content/blogs.dir/1/files/2017/04/Grasshopper.jpg",
            //                     "publishedAt":"2017-04-07T16:40:26Z"}];
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
