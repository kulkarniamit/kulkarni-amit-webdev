(function(){
    angular
        .module("WebAppMaker")
        .factory("WebsiteService",WebsiteService);

    function WebsiteService($http) {
        var api={
            "createWebsite":createWebsite,
            "findWebsitesByUser":findWebsitesByUser,
            "findWebsitesById":findWebsitesById,
            "updateWebsite":updateWebsite,
            "deleteWebsite":deleteWebsite
        };

        return api;
        function createWebsite(userId, website) {
            return $http.post("/api/user/"+userId+"/website", website);
        }
        function findWebsitesByUser(uid) {
            return $http.get("/api/user/"+uid+"/website");
        }
        function findWebsitesById(wid) {
            return $http.get("/api/website/"+wid);
        }
        function updateWebsite(wid, updatedWebsite) {
            return $http.put("/api/website/"+wid, updatedWebsite);
        }
        function deleteWebsite(wid) {
            return $http.delete("/api/website/"+wid);
        }
    }
})();