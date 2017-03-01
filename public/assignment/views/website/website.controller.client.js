(function() {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        function init(){
            WebsiteService
                .findWebsitesByUser(vm.userId)
                .success(function (response) {
                    vm.websites = response;
                    if(vm.websites.length == 0){
                        vm.error = "No websites created yet";
                    }
                });
        }
        init();
    }
    
    function NewWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        function init(){
            WebsiteService
                .findWebsitesByUser(vm.userId)
                .success(function (response) {
                    vm.websites = response;
                    if(vm.websites.length == 0){
                        vm.error = "No websites created yet";
                    }
                });
        }
        init();
        vm.addNewWebsite = addNewWebsite;
        function addNewWebsite(website) {
            if(website == null || website.name == null || website.name == "" || website.description == ""){
                vm.blankerror = "Please enter the website name and description";
                return;
            }
            WebsiteService
                .createWebsite(vm.userId,website)
                .success(function (response) {
                    var newWebsite = response;
                    if(website){
                        $location.url("/user/"+vm.userId+"/website");
                    }
                })
                .error(function (response) {
                    vm.error = "Could not create website, try again after some time";
                    return;
                });
        }
    }
    
    function EditWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        function init() {
            WebsiteService
                .findWebsitesById(vm.websiteId)
                .success(function (response) {
                    vm.website = response;
                    if(vm.website){
                        WebsiteService
                            .findWebsitesByUser(vm.userId)
                            .success(function (response) {
                                vm.websites = response;
                                if(vm.websites.length == 0){
                                    vm.error = "No websites created yet";
                                }
                            });
                    }
                });
        }
        init();

        function updateWebsite(website) {
            if(website == null || website.name == null || website.name == "" || website.description == ""){
                vm.blankerror = "Name or description cannot be empty";
                return;
            }
            WebsiteService
                .updateWebsite(vm.websiteId, website)
                .success(function (response) {
                    var website = response;
                    $location.url("user/"+vm.userId+"/website")
                });
        }
        function deleteWebsite() {
            WebsiteService
                .deleteWebsite(vm.websiteId)
                .success(function (response) {
                    $location.url("/user/"+vm.userId+"/website");
                })
                .error(function (response) {
                    vm.deleteError = "Website could not be deleted, please try again";
                    return;
                });
        }
    }
})();