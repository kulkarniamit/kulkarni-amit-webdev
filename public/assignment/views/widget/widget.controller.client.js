(function() {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    function WidgetListController($routeParams, $location, WidgetService, $sce) {
        var vm = this;
        vm.pageId = $routeParams["pid"];
        function init(){
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pageId);
            if(vm.widgets.length == 0){
                vm.error = "No widgets used yet";
            }
        }
        init();

        vm.navigateToProfile = navigateToProfile;
        vm.navigateToPages = navigateToPages;
        vm.navigateToNewWidget = navigateToNewWidget;
        vm.navigateToEditWidget = navigateToEditWidget;
        vm.checkSafeHtml = checkSafeHtml;
        vm.checkSafeYouTubeUrl = checkSafeYouTubeUrl;

        function navigateToProfile() {
            $location.url("user/"+$routeParams["uid"]);
        }
        function navigateToPages() {
            $location.url("user/"+$routeParams["uid"]+"/website/"+$routeParams["wid"]+"/page");
        }
        function navigateToNewWidget() {
            $location.url("user/"+$routeParams["uid"]+"/website/"+$routeParams["wid"]+"/page/"+$routeParams["pid"]+"/widget/new");
        }
        function navigateToEditWidget(wgid) {
            $location.url("user/"+$routeParams["uid"]+"/website/"+$routeParams["wid"]+"/page/"+$routeParams["pid"]+"/widget/"+wgid);
        }
        function checkSafeHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function checkSafeYouTubeUrl(url) {
            var parts = url.split('/');
            var id = parts[parts.length - 1];
            url = "https://www.youtube.com/embed/"+id;
            console.log(url);
            return $sce.trustAsResourceUrl(url);
        }


    }
    
    function NewWidgetController() {
        
    }
    
    function EditWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.widgetId = $routeParams["wgid"];
        vm.widget = WidgetService.findWidgetById(vm.widgetId);
        vm.navigateToProfile = navigateToProfile;
        vm.navigateToWidgets = navigateToWidgets;
        function navigateToProfile() {
            $location.url("user/"+$routeParams["uid"]);
        }
        function navigateToWidgets() {
            $location.url("user/"+$routeParams["uid"]+"/website/"+$routeParams["wid"]+"/page/"+$routeParams["pid"]+"/widget");
        }
    }
})();