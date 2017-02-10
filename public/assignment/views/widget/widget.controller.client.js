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
    
    function NewWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;

        vm.navigateToProfile = navigateToProfile;
        vm.navigateToWidgets = navigateToWidgets;
        vm.createHeaderWidget = createHeaderWidget;
        vm.createImageWidget = createImageWidget;
        vm.createYoutubeWidget = createYoutubeWidget;

        function navigateToProfile() {
            $location.url("user/"+vm.uid);
        }
        function navigateToWidgets() {
            $location.url("user/"+vm.uid+"/website/"+vm.wid+"/page/"+vm.pid+"/widget");
        }

        function createHeaderWidget(headerSize) {
            var widget = {type: "HEADER",
                          size: headerSize,
                          text: "Sample Heading "+headerSize}
            var newWidget = WidgetService.createWidget(vm.pid, widget);
            if(newWidget != null){
                $location.url("/user/"+vm.uid+"/website/"+vm.wid+"/page/"+vm.pid+"/widget/"+newWidget._id);
            }
        }

        function createImageWidget() {
            var widget = {type: "IMAGE",
                width: "100%",
                url: "https://www.djaysgourmet.com.au/wp-content/uploads/2016/02/sample.jpg"}
            var newWidget = WidgetService.createWidget(vm.pid, widget);
            if(newWidget != null){
                $location.url("/user/"+vm.uid+"/website/"+vm.wid+"/page/"+vm.pid+"/widget/"+newWidget._id);
            }
        }
        function createYoutubeWidget() {
            var widget = {type: "YOUTUBE",
                width: "100%",
                url: "https://www.youtube.com/embed/vlDzYIIOYmM"}
            var newWidget = WidgetService.createWidget(vm.pid, widget);
            if(newWidget != null){
                $location.url("/user/"+vm.uid+"/website/"+vm.wid+"/page/"+vm.pid+"/widget/"+newWidget._id);
            }
        }
    }
    
    function EditWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.wgid = $routeParams.wgid;

        function init() {
            vm.widget = WidgetService.findWidgetById(vm.wgid);
        }
        init();
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;
        vm.navigateToProfile = navigateToProfile;
        vm.navigateToWidgets = navigateToWidgets;

        function updateWidget(updatedWidget) {
            var updatedWidgetObject = WidgetService.updateWidget(vm.wgid, updatedWidget);
            if(updatedWidgetObject == null){
                vm.updateerror = "Could not update the widget!";
                return;
            }
            else{
                $location.url("/user/"+vm.uid+"/website/"+vm.wid+"/page/"+vm.pid+"/widget");
            }
        }

        function deleteWidget(wgid) {
            var deleteResult = WidgetService.deleteWidget(wgid);
            if(deleteResult == null){
                vm.deleteerror = "Could not delete the widget!";
                return;
            }
            else{
                $location.url("/user/"+vm.uid+"/website/"+vm.wid+"/page/"+vm.pid+"/widget");
            }
        }
        function navigateToProfile() {
            $location.url("user/"+vm.uid);
        }
        function navigateToWidgets() {
            $location.url("user/"+vm.uid+"/website/"+vm.wid+"/page/"+vm.pid+"/widget");
        }
    }
})();