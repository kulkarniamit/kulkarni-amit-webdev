(function () {
    angular
        .module("TheNewsNetwork")
        .factory("AdminService",AdminService);

    function AdminService($http) {
        var api = {
            "searchNews":searchNews
        };
        return api;

        function searchNews() {
            return $http.get(urlBase+"&apikey="+key);
        }
    }
})();
