(function() {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController() {
        
    }
    
    function NewWebsiteController() {
        
    }
    
    function EditWebsiteController($routeParams, WebsiteService, $location) {
        var vm = this;
        vm.websiteId = $routeParams["wid"];
        function init() {
            vm.website = WebsiteService.findWebsiteById(vm.websiteId);
            if (vm.website == null){
                $location.url("user/"+$routeParams["uid"]+"/website");
            }
        }
        init();

    }
})();