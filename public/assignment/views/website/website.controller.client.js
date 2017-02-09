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
        vm.navigateToWebsitePages = navigateToWebsitePages;
        vm.navigateToWebsiteEdit = navigateToWebsiteEdit;

        function navigateToProfile() {
            $location.url("user/"+$routeParams["uid"]);
        }
        function navigateToNewWebsite() {
            $location.url("user/"+$routeParams["uid"]+"/website/new");
        }
        function navigateToWebsitePages(wid) {
            $location.url("user/"+$routeParams["uid"]+"/website/"+wid+"/page");
        }
        function navigateToWebsiteEdit(wid) {
            $location.url("user/"+$routeParams["uid"]+"/website/"+wid);
        }
    }
    
    function NewWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        function init(){
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
            if(vm.websites.length == 0){
                vm.error = "No websites created yet";
            }
        }
        init();
        vm.addNewWebsite = addNewWebsite;
        vm.navigateToProfile = navigateToProfile;
        vm.navigateToNewWebsite = navigateToNewWebsite;
        vm.navigateToWebsites = navigateToWebsites;
        vm.navigateToWebsitePages = navigateToWebsitePages;
        vm.navigateToWebsiteEdit = navigateToWebsiteEdit;

        function addNewWebsite(website) {
            if(website == null || website.name == "" || website.description == ""){
                vm.blankerror = "Please enter the website name and description";
                return;
            }
            var website = WebsiteService.createWebsite(vm.userId,website);
            if(website == null){
                vm.error = "Could not create website, try again after some time";
                return;
            }
            else{
                $location.url("/user/"+vm.userId+"/website");
            }
        }
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
    
    function EditWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;
        vm.navigateToProfile = navigateToProfile;
        vm.navigateToNewWebsite = navigateToNewWebsite;
        vm.navigateToWebsites = navigateToWebsites;
        vm.navigateToWebsitePages = navigateToWebsitePages;
        vm.navigateToWebsiteEdit = navigateToWebsiteEdit;
        function init() {
            vm.website = WebsiteService.findWebsitesById(vm.websiteId);
            if (vm.website == null){
                $location.url("user/"+$routeParams["uid"]+"/website");
            }

            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
            if(vm.websites.length == 0){
                vm.error = "No websites created yet";
            }
        }
        init();

        function updateWebsite(website) {
            if(website == null || website.name == "" || website.description == ""){
                vm.blankerror = "Name or description cannot be empty";
                return;
            }
            var website = WebsiteService.updateWebsite(vm.websiteId, website);
            if(website == null){
                vm.error = "Update failed, please try again later";
            }
            else {
                $location.url("user/"+vm.userId+"/website")
            }
        }
        function deleteWebsite() {
            var result = WebsiteService.deleteWebsite(vm.websiteId);
            if(result == null){
                vm.deleteError = "Website could not be deleted, please try again";
                return;
            }
            else{
                $location.url("/user/"+vm.userId+"/website");
            }
        }
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
})();