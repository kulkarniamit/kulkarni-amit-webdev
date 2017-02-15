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
            vm.pages = PageService.findPagesByWebsiteId(vm.websiteId);
            if(vm.pages.length == 0){
                vm.error = "No pages created yet";
            }
        }
        init();
    }
    
    function NewPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        function init(){
            vm.pages = PageService.findPagesByWebsiteId(vm.websiteId);
            if(vm.pages.length == 0){
                vm.error = "No pages created yet";
            }
        }
        init();

        vm.addNewPage = addNewPage;
        function addNewPage(newPage) {
            if(newPage == null || newPage.name == null || newPage.name == "" || newPage.description == ""){
                vm.blankerror = "Please enter the page name and description";
                return;
            }
            var page = PageService.createPage(vm.websiteId,newPage);
            if(page == null){
                vm.error = "Could not create page, try again after some time";
                return;
            }
            else{
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
            }
        }
    }
    
    function EditPageController($routeParams, PageService, $location) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.pageId = $routeParams["pid"];
        vm.websiteId = $routeParams["wid"];
        function init() {
            vm.page = PageService.findPageById(vm.pageId);
            if (vm.page == null){
                $location.url("user/"+vm.userId+"/website/"+vm.websiteId+"/page");
            }
            vm.pages = PageService.findPagesByWebsiteId(vm.websiteId);
            if(vm.pages.length == 0){
                vm.error = "No pages created yet";
            }
        }
        init();

        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function updatePage(page) {
            if(page == null || page.name == null || page.name == "" || page.description == ""){
                vm.blankerror = "Name or description cannot be empty";
                return;
            }
            var page = PageService.updatePage(vm.pageId, page);
            if(page == null){
                vm.error = "Update failed, please try again later";
            }
            else {
                $location.url("user/"+vm.userId+"/website/"+vm.websiteId+"/page");
            }
        }
        function deletePage() {
            var result = PageService.deletePage(vm.pageId);
            if(result == null){
                vm.deleteError = "Page could not be deleted, please try again";
                return;
            }
            else{
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
            }
        }
    }
})();