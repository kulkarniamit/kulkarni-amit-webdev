(function() {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        function init(){
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
            if(vm.websites.length == 0){
                vm.error = "No websites created yet";
            }
        }
        init();
        vm.navigateToProfile = navigateToProfile;
        vm.navigateToNewWebsite = navigateToNewWebsite;
        vm.navigateToWebsites = navigateToWebsites;
        vm.navigateToWebsitePages = navigateToWebsitePages;
        vm.navigateToWebsiteEdit = navigateToWebsiteEdit;

        function navigateToProfile() {
            $location.url("user/"+$routeParams["uid"]);
        }
        function navigateToNewWebsite() {
            $location.url("user/"+$routeParams["uid"]+"/website/new");
        }
        function navigateToWebsites() {
            $location.url("user/"+$routeParams["uid"]+"/website");
        }
        function navigateToWebsitePages(wid) {
            $location.url("user/"+$routeParams["uid"]+"/website/"+wid+"/page");
        }
        function navigateToWebsiteEdit(wid) {
            $location.url("user/"+$routeParams["uid"]+"/website/"+wid);
        }
    }
    
    function NewWebsiteController($routeParams, $location) {
        var vm = this;
        vm.navigateToProfile = navigateToProfile;
        vm.navigateToWebsites = navigateToWebsites;
        function navigateToProfile() {
            $location.url("user/"+$routeParams["uid"]);
        }
        function navigateToWebsites() {
            $location.url("user/"+$routeParams["uid"]+"/website");
        }
    }
    
    function EditWebsiteController($routeParams, WebsiteService, $location) {
        var vm = this;
        vm.websiteId = $routeParams["wid"];
        vm.navigateToProfile = navigateToProfile;
        vm.navigateToNewWebsite = navigateToNewWebsite;
        vm.navigateToWebsites = navigateToWebsites;
        function init() {
            vm.website = WebsiteService.findWebsitesById(vm.websiteId);
            if (vm.website == null){
                $location.url("user/"+$routeParams["uid"]+"/website");
            }
        }
        init();
        function navigateToProfile() {
            $location.url("user/"+$routeParams["uid"]);
        }
        function navigateToNewWebsite() {
            $location.url("user/"+$routeParams["uid"]+"/website/new");
        }
        function navigateToWebsites() {
            $location.url("user/"+$routeParams["uid"]+"/website");
        }
    }
})();