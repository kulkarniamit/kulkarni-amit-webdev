(function() {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, PageService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        function init(){
            PageService
                .findPagesByWebsiteId(vm.websiteId)
                .success(function (response) {
                    vm.pages = response;
                    if(vm.pages.length == 0){
                        vm.error = "No pages created yet";
                    }
                })
                .error(function (response) {
                    vm.error = "Could not find the pages";
                });
        }
        init();
    }
    
    function NewPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.addNewPage = addNewPage;
        function init(){
            PageService
                .findPagesByWebsiteId(vm.websiteId)
                .success(function (response) {
                    vm.pages = response;
                    if(vm.pages.length == 0){
                        vm.error = "No pages created yet";
                    }
                });
        }
        init();

        function addNewPage(newPage) {
            if(newPage == null || newPage.name == null || newPage.name == "" || newPage.description == ""){
                vm.blankerror = "Please enter the page name and description";
                return;
            }
            PageService
                .createPage(vm.websiteId,newPage)
                .success(function (response) {
                    if(response){
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                    }
                })
                .error(function (response) {
                    vm.error = "Could not create page, try again after some time";
                });
        }
    }
    
    function EditPageController($routeParams, PageService, $location) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.pageId = $routeParams["pid"];
        vm.websiteId = $routeParams["wid"];
        function init() {
            PageService
                .findPageById(vm.pageId)
                .success(function (response) {
                    vm.page = response;
                    if(vm.page){
                        PageService
                            .findPagesByWebsiteId(vm.websiteId)
                            .success(function (response) {
                                vm.pages = response;
                                if(vm.pages.length == 0){
                                    vm.error = "No pages created yet";
                                }
                            });
                    }
                })
                .error(function (response) {
                    $location.url("user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                });
        }
        init();

        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function updatePage(page) {
            if(page == null || page.name == null || page.name == "" || page.description == ""){
                vm.blankerror = "Name or description cannot be empty";
                return;
            }
            PageService
                .updatePage(vm.pageId, page)
                .success(function (response) {
                    var page = response;
                    if(page){
                        $location.url("user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                    }
                })
                .error(function (response) {
                    vm.error = "Update failed, please try again later";
                });
        }
        function deletePage() {
            PageService
                .deletePage(vm.pageId)
                .success(function (response) {
                    if(response){
                        $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                    }
                })
                .error(function (response) {
                    vm.deleteError = "Page could not be deleted, please try again";
                    return;
                });
        }
    }
})();