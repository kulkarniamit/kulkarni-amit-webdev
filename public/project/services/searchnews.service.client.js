(function () {
    angular
        .module("TheNewsNetwork")
        .factory("SearchNewsService",SearchNewsService);
    function SearchNewsService($http) {
        var key = "4a627d8d3dd14b7595d5b3098452f281";
        var urlBase = "https://newsapi.org/v1/articles";

        var api = {
            "searchNews":searchNews
        };
        return api;

        function searchNews(source) {
            var url = urlBase+"?source="+source+"&apikey="+key;
            return $http.get(url);
        }
    }
})();
