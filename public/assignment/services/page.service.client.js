(function(){
    angular
        .module("WebAppMaker")
        .factory("PageService",PageService);

    function PageService() {
        var pages = [
            {_id: "321", name : "Post 1", websiteId: "456", description:"Lorem"},
            {_id: "432", name : "Post 2", websiteId: "789", description:"Lorem"},
            {_id: "543", name : "Post 3", websiteId: "111", description:"Lorem"}
        ];

        var api={
            "createPage":createPage,
            "findPageByWebsiteId":findPageByWebsiteId,
            "findPageById":findPageById,
            "updatePage":updatePage,
            "deletePage":deletePage
        };

        return api;
        function createPage() {}
        function findPageByWebsiteId() {}
        function findPageById(pid) {
            for(var i = 0; i< pages.length;i++){
                if(pages[i]._id === pid){
                    var page = JSON.parse(JSON.stringify(pages[i]));
                    return page;
                }
            }
            return null;
        }
        function updatePage() {}
        function deletePage() {}
    }
})();