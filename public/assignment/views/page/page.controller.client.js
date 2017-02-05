(function() {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController() {
        
    }
    
    function NewPageController() {
        
    }
    
    function EditPageController($routeParams, PageService, $location) {
        var vm = this;
        vm.pageId = $routeParams["pid"];
        function init() {
            vm.page = PageService.findPageById(vm.pageId);
            if (vm.page == null){
                $location.url("user/"+$routeParams["uid"]+"/website/"+$routeParams["wid"]+"/page");
            }
        }
        init();
    }
})();