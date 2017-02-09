(function() {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, $location, PageService) {
        var vm = this;
        vm.websiteId = $routeParams["wid"];
        function init(){
            vm.pages = PageService.findPagesByWebsiteId(vm.websiteId);
            if(vm.pages.length == 0){
                vm.error = "No pages created yet";
            }
        }
        init();

        vm.navigateToProfile = navigateToProfile;
        vm.navigateToNewPage = navigateToNewPage;
        vm.navigateToWebsites = navigateToWebsites;
        vm.navigateToPageWidgets = navigateToPageWidgets;
        vm.navigateToPageEdit = navigateToPageEdit;

        function navigateToProfile() {
            $location.url("user/"+$routeParams["uid"]);
        }
        function navigateToNewPage() {
            $location.url("user/"+$routeParams["uid"]+"/website/"+$routeParams["wid"]+"/page/new");
        }
        function navigateToWebsites() {
            $location.url("user/"+$routeParams["uid"]+"/website/");
        }
        function navigateToPageWidgets(pid) {
            $location.url("user/"+$routeParams["uid"]+"/website/"+$routeParams["wid"]+"/page/"+pid+"/widget");
        }
        function navigateToPageEdit(pid) {
            $location.url("user/"+$routeParams["uid"]+"/website/"+$routeParams["wid"]+"/page/"+pid);
        }
    }
    
    function NewPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.websiteId = $routeParams["wid"];
        function init(){
            vm.pages = PageService.findPagesByWebsiteId(vm.websiteId);
            if(vm.pages.length == 0){
                vm.error = "No pages created yet";
            }
        }
        init();

        vm.addNewPage = addNewPage;
        vm.navigateToProfile = navigateToProfile;
        vm.navigateToNewPage = navigateToNewPage;
        vm.navigateToPages = navigateToPages;
        vm.navigateToPageWidgets = navigateToPageWidgets;
        vm.navigateToPageEdit = navigateToPageEdit;

        function addNewPage(newPage) {
            if(newPage == null || newPage.name == "" || newPage.description == ""){
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
        function navigateToProfile() {
            $location.url("user/"+$routeParams["uid"]);
        }
        function navigateToNewPage() {
            $location.url("user/"+$routeParams["uid"]+"/website/"+$routeParams["wid"]+"/page/new");
        }
        function navigateToPages() {
            $location.url("user/"+$routeParams["uid"]+"/website/"+$routeParams["wid"]+"/page");
        }
        function navigateToPageWidgets(pid) {
            $location.url("user/"+$routeParams["uid"]+"/website/"+$routeParams["wid"]+"/page/"+pid+"/widget");
        }
        function navigateToPageEdit(pid) {
            $location.url("user/"+$routeParams["uid"]+"/website/"+$routeParams["wid"]+"/page/"+pid);
        }
    }
    
    function EditPageController($routeParams, PageService, $location) {
        var vm = this;
        vm.pageId = $routeParams["pid"];
        vm.websiteId = $routeParams["wid"];
        function init() {
            vm.page = PageService.findPageById(vm.pageId);
            if (vm.page == null){
                $location.url("user/"+$routeParams["uid"]+"/website/"+$routeParams["wid"]+"/page");
            }
            vm.pages = PageService.findPagesByWebsiteId(vm.websiteId);
            if(vm.pages.length == 0){
                vm.error = "No pages created yet";
            }
        }
        init();
        vm.navigateToProfile = navigateToProfile;
        vm.navigateToNewPage = navigateToNewPage;
        vm.navigateToPages = navigateToPages;
        vm.navigateToPageWidgets = navigateToPageWidgets;
        vm.navigateToPageEdit = navigateToPageEdit;
        function navigateToProfile() {
            $location.url("user/"+$routeParams["uid"]);
        }
        function navigateToNewPage() {
            $location.url("user/"+$routeParams["uid"]+"/website/"+$routeParams["wid"]+"/page/new");
        }
        function navigateToPages() {
            $location.url("user/"+$routeParams["uid"]+"/website/"+$routeParams["wid"]+"/page");
        }
        function navigateToPageWidgets(pid) {
            $location.url("user/"+$routeParams["uid"]+"/website/"+$routeParams["wid"]+"/page/"+pid+"/widget");
        }
        function navigateToPageEdit(pid) {
            $location.url("user/"+$routeParams["uid"]+"/website/"+$routeParams["wid"]+"/page/"+pid);
        }
    }
})();