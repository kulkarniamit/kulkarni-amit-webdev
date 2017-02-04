(function(){
    angular
        .module("WebAppMaker")
        .factory("WebsiteService",WebsiteService);

    function WebsiteService() {
        var websites = [
            {_id: "123", name : "Facebook", developerId: "456", description:"Lorem"},
            {_id: "234", name : "Twitter", developerId: "789", description:"Lorem"},
            {_id: "345", name : "Gizmodo", developerId: "111", description:"Lorem"},
            {_id: "456", name : "Tic Tac Toe", developerId: "222", description:"Lorem"},
            {_id: "456", name : "Checkers", developerId: "333", description:"Lorem"},
            {_id: "456", name : "Chess", developerId: "444", description:"Lorem"}
        ];

        var api={
            "createWebsite":createWebsite,
            "findWebsitesByUser":findWebsitesByUser,
            "findWebsiteById":findWebsiteById,
            "updateWebsite":updateWebsite,
            "deleteWebsite":deleteWebsite
        };

        return api;
        function createWebsite(userId, website) {
        }
    }
})();