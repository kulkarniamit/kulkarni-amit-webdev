(function () {
    angular
        .module("TheNewsNetwork")
        .factory("HomeNewsService",HomeNewsService);

    function HomeNewsService($http) {
        var key = "4a627d8d3dd14b7595d5b3098452f281";
        var urlBase = "https://newsapi.org/v1/articles?source=the-next-web";

        var api = {
            "searchNews":searchNews
        };
        return api;

        function searchNews() {
            return $http.get(urlBase+"&apikey="+key);
        }
    }
})();
