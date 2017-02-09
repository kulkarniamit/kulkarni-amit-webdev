(function(){
    angular
        .module("WebAppMaker")
        .factory("PageService",PageService);

    function PageService() {
        var pages = [
            {_id: "321", name : "Post 1", websiteId: "123", description:"Lorem"},
            {_id: "432", name : "Post 2", websiteId: "111", description:"Lorem"},
            {_id: "543", name : "Post 3", websiteId: "111", description:"Lorem"},
            {_id: "123", name : "Post 4", websiteId: "123", description:"Lorem"},
            {_id: "456", name : "Post 5", websiteId: "123", description:"Lorem"}
        ];

        var api={
            "createPage":createPage,
            "findPagesByWebsiteId":findPagesByWebsiteId,
            "findPageById":findPageById,
            "updatePage":updatePage,
            "deletePage":deletePage
        };

        return api;
        function createPage() {}
        function findPagesByWebsiteId(wid) {
            var pagesList = [];
            for(var i = 0; i< pages.length;i++){
                if(pages[i].websiteId === wid){
                    var page = angular.copy(pages[i]);
                    pagesList.push(page);
                }
            }
            return pagesList;
        }
        function findPageById(pid) {
            for(var i = 0; i< pages.length;i++){
                if(pages[i]._id === pid){
                    var page = angular.copy(pages[i]);
                    return page;
                }
            }
            return null;
        }
        function updatePage() {}
        function deletePage() {}
    }
})();