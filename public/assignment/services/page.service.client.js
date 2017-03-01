(function(){
    angular
        .module("WebAppMaker")
        .factory("PageService",PageService);

    function PageService($http) {
        var api={
            "createPage":createPage,
            "findPagesByWebsiteId":findPagesByWebsiteId,
            "findPageById":findPageById,
            "updatePage":updatePage,
            "deletePage":deletePage
        };

        return api;
        function createPage(wid, newPage) {
            return $http.post("/api/website/"+wid+"/page", newPage);
        }
        function findPagesByWebsiteId(wid) {
            return $http.get("/api/website/"+wid+"/page");
        }
        function findPageById(pid) {
            return $http.get("/api/page/"+pid);
        }
        function updatePage(pid, updatedPage) {
            return $http.put("/api/page/"+pid, updatedPage);
        }
        function deletePage(pid) {
            return $http.delete("/api/page/"+pid);
        }
    }
})();